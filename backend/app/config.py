from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str = "VOTRE_URL_SUPABASE"
    SUPABASE_KEY: str = "VOTRE_CLE_ANON_SUPABASE"
    # Clé secrète pour la vérification du JWT (à obtenir de Supabase)
    JWT_SECRET: str = "VOTRE_JWT_SECRET_SUPABASE"
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"

settings = Settings()
