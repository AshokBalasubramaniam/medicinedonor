use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Admin {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub password: String,
    pub otp: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AdminLogin {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct ForgetPasswordRequest {
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct ResetPasswordRequest {
    pub email: String,
    pub otp: String,
    pub new_password: String,
}
