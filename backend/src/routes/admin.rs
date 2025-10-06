use crate::routes::get_all_pateints_details::get_all_patientsdetails;
use crate::utils::jwt::create_jwt;
use crate::{
    models::admin::{Admin, AdminLogin, ForgetPasswordRequest, ResetPasswordRequest},
    models::patient::{Patient},
    state::AppState,
  
};
use axum::extract::Multipart;
use axum::extract::Path;
use axum::routing::{get, put};
use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use lettre::message::{header, Message};
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::SmtpTransport;
use lettre::Transport;
use mongodb::bson::oid::ObjectId;
use mongodb::{bson::doc, Collection};
use rand::Rng;
use serde_json::json;
use std::env;
use std::path::Path as StdPath;
use tokio::io::AsyncWriteExt;

pub fn admin_routes(state: AppState) -> Router {
  
    Router::new()
        .route("/adminpage", post(admin_login))
        .route("/adminpage/getpatients", get(get_all_patientsdetails))
        .route("/adminpage/forget", post(forget_password))
        .route("/adminpage/reset", post(reset_password))
        .route("/adminpage/patients", get(get_all_patients))
        .route("/adminpage/patients/:id", get(get_patient_by_id))
        .route("/admin/updatepatient/:id", put(update_patient))
        .with_state(state)
}

pub async fn admin_login(
    State(state): State<AppState>,
    Json(payload): Json<AdminLogin>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let collection: Collection<mongodb::bson::Document> = state.db.collection("adminpage");

    // 1️⃣ Find admin by email
    let admin_doc = collection
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

    // 2️⃣ Check password (plain text)
    let stored_password = admin_doc.get_str("password").map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": "Password missing"})),
        )
    })?;

    if stored_password != payload.password {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid credentials"})),
        ));
    }

    // 3️⃣ Convert document -> Admin struct
    let admin: Admin = mongodb::bson::from_document(admin_doc.clone()).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("Decode error: {}", e)})),
        )
    })?;

    // 4️⃣ Prepare response (without password)
    let user_resp = json!({
        "id": admin.id.as_ref().map(|oid| oid.to_hex()),
        "email": admin.email,
    });

    // 5️⃣ Create JWT
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "change_this_secret".to_string());
    let user_id = user_resp.get("id").and_then(|v| v.as_str()).unwrap_or("");
    let token = create_jwt(user_id, &admin.email, &secret, 7).map_err(|e| {
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


pub async fn send_otp_mail(to: &str, otp: &str) -> Result<(), String> {
    let email = Message::builder()
        .from("Your App <ashper916@gmail.com>".parse().unwrap()) // 🔴 replace with your Gmail
        .to(to.parse().unwrap())
        .subject("Your OTP Code")
        .header(header::ContentType::TEXT_PLAIN)
        .body(format!("Your OTP code is: {}", otp))
        .map_err(|e| e.to_string())?;

    let creds = Credentials::new(
        "ashper916@gmail.com".to_string(), // 🔴 replace with your Gmail
        "scbr uloa lzjz teqv".to_string(),   // 🔴 replace with Gmail App Password
    );

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => {
            println!("✅ OTP sent to {}", to);
            Ok(())
        }
        Err(e) => {
            println!("❌ Could not send OTP: {:?}", e);
            Err(e.to_string())
        }
    }
}

pub async fn forget_password(
    State(state): State<AppState>,
    Json(payload): Json<ForgetPasswordRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let collection = state.db.collection::<Admin>("adminpage");
    let otp: String = rand::thread_rng().gen_range(100000..999999).to_string();

    let filter = doc! { "email": &payload.email };
    let update = doc! { "$set": { "otp": &otp } };

    match collection.update_one(filter.clone(), update, None).await {
        Ok(result) if result.matched_count > 0 => {
            // ✅ Send OTP via Gmail
            if let Err(err) = send_otp_mail(&payload.email, &otp).await {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({ "error": format!("Mail send failed: {}", err) })),
                ));
            }

            Ok((
                StatusCode::OK,
                Json(json!({"message": "OTP sent to email"})),
            ))
        }
        _ => Err((
            StatusCode::NOT_FOUND,
            Json(json!({"error": "Email not found"})),
        )),
    }
}

pub async fn reset_password(
    State(state): State<AppState>,
    Json(payload): Json<ResetPasswordRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    let collection = state.db.collection::<Admin>("adminpage");

    let filter = doc! { "email": &payload.email, "otp": &payload.otp };
    let update = doc! { "$set": { "password": &payload.new_password }, "$unset": { "otp": "" } };

    match collection.update_one(filter, update, None).await {
        Ok(result) if result.matched_count > 0 => Ok((
            StatusCode::OK,
            Json(json!({"message": "Password reset successful"})),
        )),
        _ => Err((
            StatusCode::UNAUTHORIZED,
            Json(json!({"error": "Invalid OTP or email"})),
        )),
    }
}
use futures::TryStreamExt;

pub async fn get_all_patients(
    State(state): State<AppState>,
) -> Result<Json<Vec<serde_json::Value>>, (StatusCode, Json<serde_json::Value>)> {
    let coll = state.db.collection::<Patient>("patients");

    let mut cursor = coll.find(None, None).await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("DB error: {}", e)})),
        )
    })?;

    let mut patients = Vec::new();
    while let Some(patient) = cursor.try_next().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("Cursor error: {}", e)})),
        )
    })? {
        patients.push(json!({
            "_id": patient.id.map(|oid| oid.to_hex()),
            "name": patient.name,
            "email": patient.email,
            "age": patient.age,
            "mobile": patient.mobile,
            "hospitalname": patient.hospitalname,
            "doctor": patient.doctor,
            "date": patient.date,
            "time": patient.time,
            "disease": patient.disease,
            "approved": patient.approved,
            "medicines": patient.medicines,
            "created_at": patient.created_at,
            "image": patient.image,
        }));
    }
    println!("Patients: {:#?}", patients);

    Ok(Json(patients))
}

pub async fn get_patient_by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let coll: Collection<Patient> = state.db.collection("patients");

    let obj_id = match ObjectId::parse_str(&id) {
        Ok(oid) => oid,
        Err(_) => return Err((StatusCode::BAD_REQUEST, Json(json!({"error":"Invalid ID"})))),
    };

    match coll.find_one(doc! { "_id": obj_id }, None).await {
        Ok(Some(patient)) => {
            let id_hex = patient
                .id
                .clone()
                .map(|oid| oid.to_hex())
                .unwrap_or_default();

            let resp = json!({
                "_id": id_hex,
                "name": patient.name,
                "email": patient.email,
                "age": patient.age,
                "mobile": patient.mobile,
                "hospitalname": patient.hospitalname,
                "doctor": patient.doctor,
                "date": patient.date,
                "time": patient.time,
                "disease": patient.disease,
                "approved": patient.approved,
                "medicines": patient.medicines,
                "created_at": patient.created_at,
                "image": patient.image,
            });
            Ok(Json(resp))
        }

        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            Json(json!({"error":"Patient not found"})),
        )),
        Err(err) => {
            eprintln!("DB error: {:?}", err);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":"DB error"})),
            ))
        }
    }
}

use mongodb::bson::Document;

pub async fn update_patient(
    Path(id): Path<String>,
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> (StatusCode, Json<serde_json::Value>) {
    let coll: Collection<Document> = state.db.collection("patients");

    let obj_id = match ObjectId::parse_str(&id) {
        Ok(oid) => oid,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"error": "Invalid patient id"})),
            )
        }
    };

    let mut update_doc = doc! {};
    let mut uploaded_image: Option<String> = None;

    let upload_dir = "./uploads";
    if !StdPath::new(upload_dir).exists() {
        if let Err(e) = tokio::fs::create_dir_all(upload_dir).await {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": format!("Failed to create uploads dir: {}", e)})),
            );
        }
    }

    while let Ok(Some(field)) = multipart.next_field().await {
        let name = field.name().unwrap_or("").to_string();

        if name == "image" {
            if let Some(file_name) = field.file_name().map(|s| s.to_string()) {
                let path = format!("{}/{}", upload_dir, file_name);
                if let Ok(data) = field.bytes().await {
                    if let Ok(mut file) = tokio::fs::File::create(&path).await {
                        if file.write_all(&data).await.is_ok() {
                            uploaded_image = Some(path);
                        }
                    }
                }
            }
        } else if let Ok(value) = field.text().await {
            // 👇 Smart type conversion
            if name == "age" {
                if let Ok(age) = value.parse::<i32>() {
                    update_doc.insert(name, age);
                }
            } else if name == "approved" || name == "rejected" {
                if let Ok(b) = value.parse::<bool>() {
                    update_doc.insert(name, b);
                }
            } else {
                update_doc.insert(name, value);
            }
        }
    }

    if let Some(img) = uploaded_image {
        update_doc.insert("image", img);
    }
    if let Some(amount) = update_doc.get("amount") {
        if let Ok(a) = amount.as_str().unwrap().parse::<f64>() {
            update_doc.insert("amount", a);
        }
    }

    if update_doc.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "No fields provided"})),
        );
    }

    match coll
        .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
        .await
    {
        Ok(res) if res.matched_count > 0 => {
            if let Ok(Some(updated)) = coll.find_one(doc! {"_id": obj_id}, None).await {
                (
                    StatusCode::OK,
                    Json(json!({"message": "Patient updated successfully", "patient": updated})),
                )
            } else {
                (
                    StatusCode::OK,
                    Json(json!({"message": "Patient updated successfully"})),
                )
            }
        }
        Ok(_) => (
            StatusCode::NOT_FOUND,
            Json(json!({"error": "Patient not found"})),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": format!("DB update error: {}", e)})),
        ),
    }
}
