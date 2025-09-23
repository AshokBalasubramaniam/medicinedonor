use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};
use hmac::{Hmac, Mac};
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

#[derive(Clone)]
pub struct Payment {
    pub razor_key_id: String,
    pub razor_key_secret: String,
    pub http_client: HttpClient,
}

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub amount_rupees: i64,
}

#[derive(Deserialize)]
pub struct VerifyPayload {
    pub razorpay_order_id: String,
    pub razorpay_payment_id: String,
    pub razorpay_signature: String,
}

#[derive(Debug, Deserialize, Clone)]
struct RazorpayOrderResponse {
    id: String,
    amount: i64,
    currency: String,
    status: String,
}

#[derive(Debug, Serialize)]
struct CreateOrderResponse {
    order_id: String,
    amount: i64,
    currency: String,
    status: String,
    key_id: String,
}

pub fn payment_routes(payment_state: Payment) -> Router {
    Router::new()
        .route("/create_order", post(create_order))
        .route("/verify_payment", post(verify_payment))
        .with_state(payment_state)
}

pub async fn create_order(
    State(state): State<Payment>,
    Json(payload): Json<CreateOrderRequest>,
) -> impl IntoResponse {
    let url = "https://api.razorpay.com/v1/orders";

    // ✅ generate short unique receipt (max 40 chars)
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let receipt = format!("rcpt_{}", timestamp); // always < 40 chars

    let res = state
        .http_client
        .post(url)
        .basic_auth(&state.razor_key_id, Some(&state.razor_key_secret))
        .json(&json!({
            "amount": payload.amount_rupees * 100, // in paise
            "currency": "INR",
            "receipt": receipt,
        }))
        .send()
        .await;

    match res {
        Ok(resp) => {
            if resp.status().is_success() {
                match resp.json::<RazorpayOrderResponse>().await {
                    Ok(order) => {
                        println!("✅ Razorpay order created: {:#?}", order);
                        (
                            StatusCode::OK,
                            Json(CreateOrderResponse {
                                order_id: order.id,
                                amount: order.amount,
                                currency: order.currency,
                                status: order.status,
                                key_id: state.razor_key_id.clone(),
                            }),
                        )
                            .into_response()
                    }
                    Err(err) => {
                        eprintln!("❌ Failed to parse Razorpay response: {:?}", err);
                        (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(json!({"error":"failed to parse razorpay response"})),
                        )
                            .into_response()
                    }
                }
            } else {
                let text = resp.text().await.unwrap_or_else(|_| "unknown error".into());
                eprintln!("❌ Razorpay returned error: {}", text);
                (StatusCode::BAD_GATEWAY, Json(json!({"error": text}))).into_response()
            }
        }
        Err(err) => {
            eprintln!("❌ Razorpay API call failed: {:?}", err);
            (
                StatusCode::BAD_GATEWAY,
                Json(json!({"error":"razorpay api request failed"})),
            )
                .into_response()
        }
    }
}

pub async fn verify_payment(
    State(state): State<Payment>,
    Json(payload): Json<VerifyPayload>,
) -> impl IntoResponse {
    let mut mac = HmacSha256::new_from_slice(state.razor_key_secret.as_bytes())
        .expect("HMAC can take key of any size");

    let data = format!(
        "{}|{}",
        payload.razorpay_order_id, payload.razorpay_payment_id
    );
    mac.update(data.as_bytes());

    // 🔑 Razorpay sends signature as HEX
    let generated_signature = hex::encode(mac.finalize().into_bytes());

    if generated_signature != payload.razorpay_signature {
        eprintln!(
            "❌ Invalid signature. Expected: {}, Got: {}",
            generated_signature, payload.razorpay_signature
        );
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "invalid signature"})),
        )
            .into_response();
    }

    (StatusCode::OK, Json(json!({"status": "payment verified"}))).into_response()
}
