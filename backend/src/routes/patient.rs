use axum::{extract::State, routing::post, Json, Router};
use axum::http::StatusCode;
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use serde_json::json;

use crate::models::patient::{LoginInput, Patient, RegisterInput};
use crate::state::AppState;
use crate::utils::password::{hash_password, verify_password};

pub fn patient_routes(state: AppState) -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/patientlogin", post(login))
        .with_state(state)
}

async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterInput>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let coll = state.db.collection::<Patient>("patients");

    let hashed_pwd = hash_password(&payload.password).map_err(internal_err)?;
    let new_patient = Patient {
        id: ObjectId::new(),
        name: payload.name,
        email: payload.email,
        password: hashed_pwd,
        created_at: DateTime::now(),
    };

    coll.insert_one(&new_patient, None).await.map_err(internal_err)?;
    Ok(Json(json!({ "message": "Patient registered successfully" })))
}

async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginInput>,
) -> Result<Json<Patient>, (StatusCode, String)> {
    let coll = state.db.collection::<Patient>("patients");

    let patient = coll.find_one(doc! {"email": &payload.email}, None)
        .await.map_err(internal_err)?
        .ok_or((StatusCode::UNAUTHORIZED, "Invalid email".into()))?;

    let is_valid = verify_password(&patient.password, &payload.password).map_err(internal_err)?;
    if !is_valid {
        return Err((StatusCode::UNAUTHORIZED, "Invalid password".into()));
    }

    Ok(Json(patient))
}

fn internal_err<E: std::fmt::Display>(e: E) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
}
