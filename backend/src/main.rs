use axum::{extract::Json, routing::post, Router};
use serde::{Deserialize, Serialize};
use std::process::Command;
use std::net::SocketAddr;
use std::time::Instant;
use tower_http::cors::{CorsLayer, Any};
    
#[derive(Deserialize)]
struct ChatRequest {
    message: String,
}

#[derive(Serialize)]
struct ChatResponse {
    response: String,
}

#[tokio::main]
async fn main() {
    // Enable CORS to allow requests from any origin
    let cors = CorsLayer::new()
        .allow_origin(Any) // Allow all origins
        .allow_headers(Any) // Allow all headers
        .allow_methods(Any); // Allow all methods (GET, POST, etc.)

    let app = Router::new()
        .route("/chat", post(chat_handler))
        .layer(cors); // Apply the CORS middleware

    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    println!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn chat_handler(Json(payload): Json<ChatRequest>) -> Json<ChatResponse> {
    let start_time = Instant::now();
    println!("Received request: {}", payload.message);

    let llama_executable = "./Llama-3.2-1B-Instruct.Q6_K.llamafile";

    // Run the Llama model executable
    let output_start = Instant::now();
    let output = Command::new(llama_executable)
        .arg("-p")
        .arg(&payload.message)
        .output();

    let output_duration = output_start.elapsed();
    match &output {
        Ok(_) => println!("Llama model executed in: {:?}", output_duration),
        Err(e) => println!("Error executing Llama: {:?}", e),
    };

    // Process the output
    let response = if let Ok(output) = output {
        if output.status.success() {
            String::from_utf8_lossy(&output.stdout).to_string()
        } else {
            format!(
                "Error: {}",
                String::from_utf8_lossy(&output.stderr)
            )
        }
    } else {
        "Error: Failed to execute Llama.".to_string()
    };

    let total_duration = start_time.elapsed();
    println!("Total request processing time: {:?}", total_duration);

    Json(ChatResponse { response })
}