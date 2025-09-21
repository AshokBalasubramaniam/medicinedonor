use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Doctor {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    #[serde(rename = "fullName")]
    pub fullname: String,
    pub email: String,
    #[serde(rename = "speciality")]
    pub specialization: String,
    pub phone: String,
    #[serde(rename = "experience")]
    pub yearsofexperience: String,
    pub qualification: String,
    #[serde(rename = "availableDays")]
    pub availabledays: String,
    #[serde(rename = "availableTimings")]
    pub availabletimings: String,
    #[serde(rename = "maxPatients")]
    pub maxpatients: i32,
    #[serde(rename = "profilePhoto")]
    pub profilephoto: Option<String>,
}
