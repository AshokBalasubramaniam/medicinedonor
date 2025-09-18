use crate::state::AppState;
use axum::{
    extract::{Multipart, State},
    http::StatusCode,
    Json,
};
use mongodb::bson::{doc, oid::ObjectId};
use serde_json::json;
use tokio::io::AsyncWriteExt;
use std::path::Path;

pub async fn update_patient_handler(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> (StatusCode, Json<serde_json::Value>) {
    let coll = state.db.collection::<mongodb::bson::Document>("patients");

    let mut obj_id: Option<ObjectId> = None;
    let mut update_doc = doc! {};
    let mut uploaded_image: Option<String> = None;

    // Ensure ./uploads directory exists
    let upload_dir = "./uploads";
    if !Path::new(upload_dir).exists() {
        if let Err(e) = tokio::fs::create_dir_all(upload_dir).await {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": format!("Failed to create uploads directory: {}", e)})),
            );
        }
    }

    // Iterate over multipart fields
    while let Ok(Some(field)) = multipart.next_field().await {
        let name = field.name().unwrap_or("").to_string();

        if name == "image" {
            if let Some(file_name) = field.file_name().map(|s| s.to_string()) {
                match field.bytes().await {
                    Ok(data) => {
                        let path = format!("{}/{}", upload_dir, file_name);
                        match tokio::fs::File::create(&path).await {
                            Ok(mut file) => {
                                if let Err(e) = file.write_all(&data).await {
                                    return (
                                        StatusCode::INTERNAL_SERVER_ERROR,
                                        Json(json!({"error": format!("Failed to write file: {}", e)})),
                                    );
                                }
                                uploaded_image = Some(path);
                            }
                            Err(e) => {
                                return (
                                    StatusCode::INTERNAL_SERVER_ERROR,
                                    Json(json!({"error": format!("Failed to create file: {}", e)})),
                                );
                            }
                        }
                    }
                    Err(e) => {
                        return (
                            StatusCode::BAD_REQUEST,
                            Json(json!({"error": format!("Failed to read file bytes: {}", e)})),
                        );
                    }
                }
            }
        } else {
            if let Ok(value) = field.text().await {
                match name.as_str() {
                    "id" => match ObjectId::parse_str(&value) {
                        Ok(oid) => obj_id = Some(oid),
                        Err(_) => {
                            return (
                                StatusCode::BAD_REQUEST,
                                Json(json!({"error": "Invalid patient id"})),
                            )
                        }
                    },
                    "name" => {
                        update_doc.insert("name", value);
                    }
                    "email" => {
                        update_doc.insert("email", value);
                    }
                    "age" => {
                        if let Ok(parsed) = value.parse::<i32>() {
                            update_doc.insert("age", parsed);
                        }
                    }
                    "date" => {
                        update_doc.insert("date", value);
                    }
                    "time" => {
                        update_doc.insert("time", value);
                    }
                    "mobile" => {
                        update_doc.insert("mobile", value);
                    }
                    "Appointment Date"=>{
                        update_doc.insert("Appointment Date", value);
                    }
                    "Appointment Time"=>{
                        update_doc.insert("Appointment Time", value);
                    }
                    "doctor" => {
                        update_doc.insert("doctor", value);
                    }
                    "disease" => {
                        update_doc.insert("disease", value);
                    }
                    "sex" => {
                        update_doc.insert("sex", value);
                    }
                    "relationshipstatus" => {
                        update_doc.insert("relationshipstatus", value);
                    }
                    "address" => {
                        update_doc.insert("address", value);
                    }
                    "hospitalname" => {
                        update_doc.insert("hospitalname", value);
                    }
                  


                    _ => {}
                }
            }
        }
    }

    // attach image path if uploaded
    if let Some(img) = uploaded_image {
        update_doc.insert("image", img);
    }

    if obj_id.is_none() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "Patient id is required"})),
        );
    }

    if update_doc.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error": "No fields provided"})),
        );
    }

    match coll
        .update_one(doc! { "_id": obj_id.unwrap() }, doc! { "$set": update_doc }, None)
        .await
    {
        Ok(res) if res.matched_count > 0 => {
            if let Ok(Some(updated)) = coll.find_one(doc! {"_id": obj_id.unwrap()}, None).await {
                return (
                    StatusCode::OK,
                    Json(json!({"message": "Patient updated successfully", "patient": updated})),
                );
            }
            (
                StatusCode::OK,
                Json(json!({"message": "Patient updated successfully"})),
            )
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
