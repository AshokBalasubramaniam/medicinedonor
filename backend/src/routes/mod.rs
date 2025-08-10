pub mod patient;
pub mod admin;
pub mod pateind_dataget;
use axum::Router;
use crate::state::AppState; // make sure you import AppState
use patient::patient_routes;
use admin::admin_routes;


pub fn routes(state: AppState) -> Router {
    Router::new()
        .nest("/api", patient_routes(state.clone()))
        .nest("/api", admin_routes(state))
}
