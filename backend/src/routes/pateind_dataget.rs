use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use mongodb::bson::{doc, oid::ObjectId};
use serde_json::json;

use crate::models::patient::Patient;
use crate::state::AppState;
use crate::utils::jwt::verify_jwt;

pub async fn get_patient_details(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let auth_header = headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|hv| hv.to_str().ok())
        .ok_or((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Missing Authorization header"})),
        ))?;

    // Expect Bearer token
    let token = auth_header.strip_prefix("Bearer ").ok_or((
        StatusCode::UNAUTHORIZED,
        Json(json!({"error": "Invalid Authorization header"})),
    ))?;

    // Verify JWT token
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
    let claims = verify_jwt(token, &secret).map_err(|_| {
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid or expired token"})),
        )
    })?;

    // Extract user id from JWT claims
    let user_id = claims.sub;

    // Parse user_id as ObjectId
    let obj_id = ObjectId::parse_str(&user_id).map_err(|_| {
        (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "Invalid user id in token"})),
        )
    })?;

    // Get MongoDB collection
    let coll = state.db.collection::<Patient>("patients");

    // Find patient by _id
    let patient = coll
        .find_one(doc! { "_id": obj_id }, None)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": format!("DB error: {}", e)})),
            )
        })?
        .ok_or((
            StatusCode::NOT_FOUND,
            Json(json!({"error": "Patient not found"})),
        ))?;
    let user_resp = json!({
        "id": patient.id.map(|oid| oid.to_hex()),
        "name": patient.name,
        "email": patient.email,
        "age": patient.age,
        "disease": patient.disease,
        "approved": patient.approved,
    });

    Ok(Json(user_resp))
}
