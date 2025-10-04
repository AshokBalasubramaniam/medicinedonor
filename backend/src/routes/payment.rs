use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};
use hmac::{Hmac, Mac};
use mongodb::bson::{doc, oid::ObjectId};
use mongodb::Database;
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};
use crate::state::get_db;
use crate::models::patient::Patient;

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
    pub patient_id: String,  
    pub amount: i64,       
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

// --------------------- Create Razorpay Order ---------------------

pub async fn create_order(
    State(state): State<Payment>,
    Json(payload): Json<CreateOrderRequest>,
) -> impl IntoResponse {
    let url = "https://api.razorpay.com/v1/orders";

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let receipt = format!("rcpt_{}", timestamp);

    let res = state
        .http_client
        .post(url)
        .basic_auth(&state.razor_key_id, Some(&state.razor_key_secret))
        .json(&json!({
            "amount": payload.amount_rupees * 100, // Razorpay expects paise
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

// --------------------- Verify Payment & Update Patient ---------------------

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

    let generated_signature = hex::encode(mac.finalize().into_bytes());

    if generated_signature != payload.razorpay_signature {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "invalid signature"})),
        )
            .into_response();
    }

    // ✅ Update MongoDB Patient record
    match update_patient_payment(&payload.patient_id, &payload.razorpay_payment_id, payload.amount).await
    {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({"status": "payment verified and updated in patient DB"})),
        )
            .into_response(),
        Err(err) => {
            eprintln!("❌ Failed to update patient DB: {:?}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": "payment verified but DB update failed"})),
            )
                .into_response()
        }
    }
}

// --------------------- MongoDB Update ---------------------

pub async fn update_patient_payment(
    patient_id: &str,
    payment_id: &str,
    amount: i64,
) -> anyhow::Result<()> {
    let db: Database = get_db().await?;
    let coll = db.collection::<Patient>("patients");

    let obj_id = ObjectId::parse_str(patient_id)?;

    // Use an aggregation-style update to recalc balance_amount
    coll.update_one(
        doc! { "_id": obj_id },
        vec![
            doc! {
                "$set": {
                    "paid_amount": { "$add": ["$paid_amount", amount] },
                }
            },
            doc! {
                "$set": {
                    "balance_amount": { "$subtract": ["$amount", "$paid_amount"] },
                    "last_payment_id": payment_id
                }
            }
        ],
        None,
    )
    .await?;

    Ok(())
}
