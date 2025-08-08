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
    
    # Variables para validación de registro de usuarios
    REGISTRO_USUARIOS_HABILITADO: bool = True
    REGISTRO_REQUIERE_VALIDACION: bool = True
    REGISTRO_ADMIN_USERNAME: str = "admin"
    REGISTRO_ADMIN_PASSWORD: str = "admin123"
    REGISTRO_DOMINIO_PERMITIDO: str = "@gadip-mc.gob.ec"
    REGISTRO_MAX_USUARIOS: int = 100
    REGISTRO_REQUIERE_APROBACION: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()