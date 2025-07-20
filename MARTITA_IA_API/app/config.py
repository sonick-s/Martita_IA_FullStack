# app/config.py

#Clase para usar variables de entorno de forma global en todo el proyecto

from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()