use axum::{
    extract::{Json, State},
    http::StatusCode,
    routing::post,
    Router,
};
use mongodb::bson::doc;
use serde_json::json;
use std::env;

use crate::{
    models::donor::{Donor, DonorLogin},
    state::AppState,
    utils::jwt::create_jwt,
    utils::password::verify_password,
};

pub fn donor_routes(state: AppState) -> Router {
    Router::new()
        .route("/donorlogin", post(donor_login))
        .with_state(state)
}

pub async fn donor_login(
    State(state): State<AppState>,
    Json(payload): Json<DonorLogin>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let collection = state.db.collection::<mongodb::bson::Document>("donors");

    // Find donor by email
    let donor_doc = collection
        .find_one(doc! { "email": &payload.email }, None)
        .await
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": "DB error"})),
            )
        })?
        .ok_or((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        ))?;

    // Extract hashed password from document
    let hashed_password = donor_doc.get_str("password").unwrap_or("");

    // Verify password
    let verified = verify_password(&payload.password, hashed_password).map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": "Password verify error"})),
        )
    })?;

    if !verified {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        ));
    }

    // Convert BSON document -> Donor struct
    let donor: Donor = mongodb::bson::from_document(donor_doc.clone()).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("Decode error: {}", e)})),
        )
    })?;

    // Build response (exclude password)
    let user_resp = json!({
        "_id": donor.id.map(|oid| oid.to_hex()),
        "name": donor.name,
        "email": donor.email,
        "age": donor.age,
        "employment": donor.employment,
        "category": donor.category,
        "place": donor.place,
        "birthday": donor.birthday,
        "image": donor.image,
    });

    // Create JWT
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
    let user_id = user_resp.get("id").and_then(|v| v.as_str()).unwrap_or("");
    let token = create_jwt(user_id, &donor.email, &secret, 7).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("Token error: {}", e)})),
        )
    })?;

    Ok(Json(json!({
        "user": user_resp,
        "token": token
    })))
}
