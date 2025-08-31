mod domain; // `mod` でディレクトリをモジュールとして宣言

use domain::database::DatabaseDomain;

#[tokio::main]
async fn main() {

    let db = DatabaseDomain;
    match db.pool().await {
        Ok(_) => println!("Database pool initialized successfully."),
        Err(e) => eprintln!("Failed to initialize database pool: {}", e),
    }
}