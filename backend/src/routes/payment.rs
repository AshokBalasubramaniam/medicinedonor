use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};
use hmac::{Hmac, Mac};
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::Sha256;
use uuid::Uuid;

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

#[derive(Serialize)]
struct CreateOrderResponse {
    order: serde_json::Value,
    key_id: String,
    order_id: String,
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

    let res = state
        .http_client
        .post(url)
        .basic_auth(&state.razor_key_id, Some(&state.razor_key_secret))
        .json(&json!({
            "amount": payload.amount_rupees * 100, // in paise
            "currency": "INR",
            "receipt": format!("rcpt_{}", Uuid::new_v4())
        }))
        .send()
        .await;

    match res {
        Ok(resp) => match resp.json::<serde_json::Value>().await {
            Ok(json_resp) => {
                // Extract order ID safely
                let order_id = json_resp
                    .get("id")
                    .and_then(|v| v.as_str())
                    .unwrap_or_else(|| {
                        eprintln!("Razorpay response missing 'id': {:?}", json_resp);
                        ""
                    })
                    .to_string();

                println!("order_id: {}", order_id);

                (
                    StatusCode::OK,
                    Json(CreateOrderResponse {
                        order: json_resp,
                        key_id: state.razor_key_id.clone(),
                        order_id,
                    }),
                )
                    .into_response()
            }
            Err(err) => {
                eprintln!("Failed to parse Razorpay response: {:?}", err);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({"error": "failed to parse razorpay response"})),
                )
                    .into_response()
            }
        },
        Err(err) => {
            eprintln!("Razorpay API request failed: {:?}", err);
            (
                StatusCode::BAD_GATEWAY,
                Json(json!({"error": "razorpay api request failed"})),
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

    // Razorpay signature is HEX, not base64
    let generated_signature = hex::encode(mac.finalize().into_bytes());

    if generated_signature != payload.razorpay_signature {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "invalid signature"})),
        )
            .into_response();
    }

    (StatusCode::OK, Json(json!({"status": "payment verified"}))).into_response()
}
