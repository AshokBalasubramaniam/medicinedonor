pub mod admin;
pub mod doctor;
pub mod pateind_dataget;
pub mod patient;
pub mod get_all_pateints_details;
pub mod update_patient;
use crate::state::AppState; // make sure you import AppState
use admin::admin_routes;
use axum::Router;
use doctor::doctor_routes;
use patient::patient_routes;


pub fn routes(state: AppState) -> Router {
    Router::new()
        .nest("/api", admin_routes(state.clone()))
        .nest("/api", patient_routes(state.clone()))
        .nest("/api", doctor_routes(state.clone()))
}
