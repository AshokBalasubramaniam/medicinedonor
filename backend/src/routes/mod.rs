pub mod patient;

use axum::Router;
use crate::state::AppState;
use self::patient::patient_routes;

pub fn routes(state: AppState) -> Router {
    Router::new().nest("/api", patient_routes(state))
}