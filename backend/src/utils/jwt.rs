use chrono::{Duration, Utc};
use jsonwebtoken::{encode, errors::Result as JwtResult, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub exp: usize,
    pub iat: usize,
}

pub fn create_jwt(user_id: &str, email: &str, secret: &str, days_valid: i64) -> JwtResult<String> {
    let now = Utc::now();
    let exp = (now + Duration::days(days_valid)).timestamp() as usize;
    let iat = now.timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_string(),
        email: email.to_string(),
        exp,
        iat,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
}

use jsonwebtoken::{decode, DecodingKey, Validation};


pub fn verify_jwt(token: &str, secret: &str) -> JwtResult<Claims> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
}

