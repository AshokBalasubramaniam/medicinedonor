use axum::{Json, extract::State, http::StatusCode, Router, routing::post};
use mongodb::bson::doc;
use serde_json::json;

use crate::{models::admin::{AdminLogin, Admin}, state::AppState, utils::password::verify_password};

pub fn admin_routes(state: AppState) -> Router {
    Router::new()
        .route("/admin/login", post(admin_login))
        .with_state(state) 
}

pub async fn admin_login(
    State(state): State<AppState>,
    Json(payload): Json<AdminLogin>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let collection = state.db.collection::<Admin>("patients");

    let filter = doc! { "email": &payload.email };

    match collection.find_one(filter, None).await {
        Ok(Some(admin)) => {
            match verify_password(&admin.password, &payload.password) {
                Ok(true) => return Ok(Json(json!({ "message": "Login success" }))),
                _ => {}
            }
        }
        Ok(None) => {}
        Err(e) => {
            return Err((StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "message": format!("DB error: {}", e) }))));
        }
    }

    Err((StatusCode::UNAUTHORIZED, Json(json!({ "message": "Invalid credentials" }))))
}
