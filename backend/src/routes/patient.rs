use axum::{
    extract::{Json, State},
    http::StatusCode,
    routing::{get, post,put},
    Router,
};
use mongodb::bson::doc;
use serde_json::json;

use crate::routes::pateind_dataget::get_patient_details;
use crate::routes::update_patient::update_patient_handler;
use crate::{
    models::donor::Donor,
    models::patient::{Patient, PatientLogin, PatientRegisterInput},
    state::AppState,
    utils::password::{hash_password, verify_password},
};
use mongodb::bson::DateTime as BsonDateTime;

use crate::utils::jwt::create_jwt;
use std::env;

pub fn patient_routes(state: AppState) -> Router {
    Router::new()
        .route("/patient/register", post(register_patient_handler))
        .route("/donor/register", post(register_donor_handler))
        .route("/patientlogin", post(patient_login))
        .route("/patientdetails", get(get_patient_details))
        .route("/patientdetails/update", put(update_patient_handler))
        .with_state(state)
}

async fn register_patient_handler(
    State(state): State<AppState>,
    Json(payload): Json<PatientRegisterInput>,
) -> (StatusCode, Json<serde_json::Value>) {
    let coll = state.db.collection::<Patient>("patients");

    // Check existing
    match coll.find_one(doc! {"email": &payload.email}, None).await {
        Ok(Some(_)) => {
            return (
                StatusCode::CONFLICT,
                Json(json!({ "message": "Email already registered" })),
            );
        }
        Ok(None) => {}
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "message": format!("DB error: {}", e) })),
            );
        }
    }

    let age: i32 = match payload.age.parse::<i32>() {
        Ok(n) => n,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({ "message": "Invalid age" })),
            )
        }
    };

    // hash password
    let hashed = match hash_password(&payload.password) {
        Ok(h) => h,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "message": format!("Hash error: {}", e) })),
            );
        }
    };

    let medicines_vec = if payload.medicine.trim().is_empty() {
        vec![]
    } else {
        vec![payload.medicine.clone()]
    };

    let new_patient = Patient {
        id: None,
        name: payload.name.clone(),
        age,
        disease: payload.disease.clone(),
        hospitalname: payload.hospitalname.clone(),
        medicines: medicines_vec,
        doctor: payload.doctor.clone(),
        date: payload.date.clone(),
        time: payload.time.clone(),
        mobile: payload.mobile.clone(),
        email: payload.email.clone(),
        password: hashed,
        approved: false,
        created_at: BsonDateTime::now(),
        image: None,
    };

    match coll.insert_one(new_patient, None).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(json!({ "message": "Patient registered successfully" })),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "message": format!("DB insert error: {}", e) })),
        ),
    }
}

async fn register_donor_handler(
    State(state): State<AppState>,
    Json(payload): Json<crate::models::donor::DonorRegisterInput>,
) -> (StatusCode, Json<serde_json::Value>) {
    let coll = state.db.collection::<Donor>("donors");

    // check
    match coll.find_one(doc! {"email": &payload.email}, None).await {
        Ok(Some(_)) => {
            return (
                StatusCode::CONFLICT,
                Json(json!({ "message": "Email already registered" })),
            );
        }
        Ok(None) => {}
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "message": format!("DB error: {}", e) })),
            );
        }
    }

    let age: i32 = match payload.age.parse::<i32>() {
        Ok(n) => n,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({ "message": "Invalid age" })),
            )
        }
    };

    let hashed = match hash_password(&payload.password) {
        Ok(h) => h,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "message": format!("Hash error: {}", e) })),
            );
        }
    };

    let new_donor = Donor {
        id: None,
        name: payload.name.clone(),
        age,
        employment: payload.employment.clone(),
        place: payload.place.clone(),
        category: payload.category.clone(),
        birthday: payload.birthday.clone(),
        email: payload.email.clone(),
        password: hashed,
        created_at: BsonDateTime::now(),
        image: payload.image.clone(),
    };

    match coll.insert_one(new_donor, None).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(json!({ "message": "Donor registered successfully" })),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "message": format!("DB insert error: {}", e) })),
        ),
    }
}

pub async fn patient_login(
    State(state): State<AppState>,
    Json(payload): Json<PatientLogin>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let collection = state.db.collection::<mongodb::bson::Document>("patients");

    // Find by email
    let patient_doc = collection
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
    let hashed_password = patient_doc.get_str("password").unwrap_or("");

    // verify_password(password, hash)
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

    // Convert Document -> Patient (so we can build a response without password)
    let patient: Patient = mongodb::bson::from_document(patient_doc.clone()).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("Decode error: {}", e)})),
        )
    })?;

    // Build user response (exclude password)
    let user_resp = json!({
        "id": patient.id.map(|oid| oid.to_hex()),
        "name": patient.name,
        "email": patient.email,
        "age": patient.age,
        // add other fields you want to expose
    });

    // create JWT
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
    let user_id = user_resp.get("id").and_then(|v| v.as_str()).unwrap_or("");
    let token = create_jwt(user_id, &patient.email, &secret, 7).map_err(|e| {
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



