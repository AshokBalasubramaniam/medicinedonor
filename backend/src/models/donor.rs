use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct Donor {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub age: i32,
    pub employment: String,
    pub place: String,
    pub category: String,
    pub birthday: String,
    pub email: String,
    pub password: String,
    pub created_at: DateTime,
    pub image: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DonorRegisterInput {
    pub name: String,
    pub age: String,
    pub employment: String,
    pub place: String,
    pub category: String,
    pub birthday: String,
    pub email: String,
    pub password: String,
    pub image: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DonorLogin {
    pub email: String,
    pub password: String,
}