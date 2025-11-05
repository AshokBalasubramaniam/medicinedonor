use axum::{
    extract::{Json, State},
    http::StatusCode,
    routing::post,
    Router,
};
use mongodb::bson::oid::ObjectId;
use serde_json::json;

use crate::{models::doctor::Doctor, state::AppState};

pub fn doctor_routes(state: AppState) -> Router {
   
    Router::new()
        .route("/admin/registerdoctor", post(register_doctor_handler))
        .with_state(state)
}

pub async fn register_doctor_handler(
    State(state): State<AppState>,
    Json(payload): Json<Doctor>,
) -> (StatusCode, Json<serde_json::Value>) {
   
    let coll = state.db.collection::<Doctor>("Doctors");

    let new_doctor = Doctor {
        id: Some(ObjectId::new()),
        fullname: payload.fullname.clone(),
        email: payload.email.clone(),
        specialization: payload.specialization.clone(),
        phone: payload.phone.clone(),
        yearsofexperience: payload.yearsofexperience.clone(),
        qualification: payload.qualification.clone(),
        availabledays: payload.availabledays.clone(),
        availabletimings: payload.availabletimings.clone(),
        maxpatients: payload.maxpatients,
        profilephoto: payload.profilephoto.clone(),
    };
    match coll.insert_one(new_doctor, None).await {
        Ok(res) => (
            StatusCode::CREATED,
            Json(json!({
                "message": "Doctor registered successfully",
                "id": res.inserted_id
            })),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "message": format!("DB error: {}", e) })),
        ),
    }
}
