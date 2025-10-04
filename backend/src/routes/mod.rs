pub mod admin;
pub mod doctor;
pub mod donor;
pub mod get_all_pateints_details;
pub mod pateind_dataget;
pub mod patient;
pub mod payment;
pub mod update_patient;

use crate::state::AppState;
use axum::Router;

use admin::admin_routes;
use doctor::doctor_routes;
use donor::donor_routes;
use patient::patient_routes;
use payment::{payment_routes, Payment};

pub fn routes(state: AppState) -> Router {
    Router::new()
        .nest("/api", admin_routes(state.clone()))
        .nest("/api", patient_routes(state.clone()))
        .nest("/api", doctor_routes(state.clone()))
        .nest("/api", donor_routes(state.clone()))
}

pub fn payment_route() -> Router {
    let payment_state = Payment {
        razor_key_id: "rzp_test_RKFCfniNFmF9k7".to_string(), // test key
        razor_key_secret: "1wQ9eNThXcVwXT5lcNwm81Q4".to_string(),
        http_client: reqwest::Client::new(), 
    };

    Router::new().nest("/api", payment_routes(payment_state))
}

