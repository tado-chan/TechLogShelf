use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use dotenv;
use std::env;

pub struct DatabaseDomain;

impl DatabaseDomain {
    pub async fn pool(&self) -> Result<Pool<Postgres>, sqlx::Error> {
        dotenv::dotenv().ok();
        let database_url = env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set in .env");
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await?;
        println!("Connected to Supabase PostgreSQL!");
        Ok(pool)
    }
}