# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import asyncio
from app.config import settings 

SQLALCHEMY_DATABASE_URL = (
    f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

ascii_art = r"""
                 __  __   _   ___ _____ ___ _____ _         ___   _   
                |  \/  | /_\ | _ \_   _|_ _|_   _/_\       |_ _| /_\ 
                | |\/| |/ _ \|   / | |  | |  | |/ _ \       | | / _ \ 
                |_|  |_/_/ \_\_|_\ |_| |___| |_/_/ \_\____ |___/_/ \_/
                                                      |___|         
                """
print(ascii_art)
print("Bienvenido a la API de Martita IA, creada como trabajo de grado -Jean De La Cruz , Omar Sani")

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session

async def test_connection():
    try:
        async with engine.connect() as conn:
            print("=" * 60)
            print("\n✅ Conexión exitosa a la base de datos usando la configuración.\n")
            print("=" * 60)
    except Exception as e:
        print("=" * 60)
        print("\n❌ Error al conectar a la base de datos:")
        print(e)
        print("=" * 60)