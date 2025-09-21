// use crate::{
//     state::AppState,

// };
// use axum::{
//     extract::State,
//     http::{HeaderMap, StatusCode},
//     Json,
// };
// use futures::StreamExt;
// use mongodb::{ Collection};
// use serde_json::json;

// use crate::utils::jwt::verify_jwt;

// pub async fn get_all_patientsdetails(
//     State(state): State<AppState>,
//     headers: HeaderMap,
// ) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
//     println!("get_all_patientsdetails called");
//     // 1️⃣ Verify JWT (no role check)
//     let auth_header = headers
//         .get(axum::http::header::AUTHORIZATION)
//         .and_then(|hv| hv.to_str().ok())
//         .ok_or((
//             StatusCode::UNAUTHORIZED,
//             Json(json!({"error": "Missing Authorization header"})),
//         ))?;

//     let token = auth_header.strip_prefix("Bearer ").ok_or((
//         StatusCode::UNAUTHORIZED,
//         Json(json!({"error": "Invalid Authorization header"})),
//     ))?;

//     let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
//     let claims = verify_jwt(token, &secret).map_err(|_| {
//         (
//             StatusCode::UNAUTHORIZED,
//             Json(json!({"error": "Invalid or expired token"})),
//         )
//     })?;

//     println!("JWT verified for user_id: {}", claims.sub);

//     // 2️⃣ Get MongoDB collection as Document
//     let coll: Collection<mongodb::bson::Document> = state.db.collection("patients");

//     // 3️⃣ Fetch all patients
//     let mut cursor = coll.find(None, None).await.map_err(|e| {
//         (
//             StatusCode::INTERNAL_SERVER_ERROR,
//             Json(json!({"error": format!("DB error: {}", e)})),
//         )
//     })?;
//     println!("Fetching all patients from database...");

//     let mut patients = vec![];
//     while let Some(doc) = cursor.next().await {
//         let doc = doc.map_err(|e| {
//             (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 Json(json!({"error": format!("Cursor error: {}", e)})),
//             )
//         })?;
//         let patient_json = serde_json::to_value(doc).map_err(|e| {
//             (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 Json(json!({"error": format!("Serialization error: {}", e)})),
//             )
//         })?;
//         patients.push(patient_json);
//     }
// println!("Total patients fetched: {}", patients.len());
// println!("patients: {:#?}", patients);
//     Ok(Json(serde_json::Value::Array(patients)))
// }

use crate::state::AppState;
use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use futures::StreamExt;
use mongodb::{Collection};
use serde_json::json;

use crate::utils::jwt::verify_jwt;

pub async fn get_all_patientsdetails(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {


    // 1️⃣ Verify JWT (no role check here)
    let auth_header = headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|hv| hv.to_str().ok())
        .ok_or((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Missing Authorization header"})),
        ))?;

    let token = auth_header.strip_prefix("Bearer ").ok_or((
        StatusCode::UNAUTHORIZED,
        Json(json!({"error": "Invalid Authorization header"})),
    ))?;

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
    let claims = verify_jwt(token, &secret).map_err(|_| {
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid or expired token"})),
        )
    })?;

    // 2️⃣ Get MongoDB collection as Document
    let coll: Collection<mongodb::bson::Document> = state.db.collection("patients");

    // 3️⃣ Fetch all patients
    let mut cursor = coll.find(None, None).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("DB error: {}", e)})),
        )
    })?;


    let mut patients = vec![];

    while let Some(result) = cursor.next().await {
        let doc = result.map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": format!("Cursor error: {}", e)})),
            )
        })?;

        // Convert BSON doc → JSON value
        let mut patient_json = serde_json::to_value(&doc).map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": format!("Serialization error: {}", e)})),
            )
        })?;

        // 🔑 Replace `_id` with string `id`
        if let Some(oid) = doc.get_object_id("_id").ok() {
            if let Some(obj) = patient_json.as_object_mut() {
                obj.insert("id".to_string(), json!(oid.to_hex()));
                obj.remove("_id");
            }
        }

        patients.push(patient_json);
    }


    Ok(Json(serde_json::Value::Array(patients)))
}
