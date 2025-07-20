from fastapi import FastAPI
from .database import engine, Base, test_connection # Importa test_connection
from fastapi.middleware.cors import CORSMiddleware
from app.routers import direcciones, tramites, requisitos_tramite, pasos_tramite, formularios_tramite, usuarios, interacciones, prompts_bot, login, construir_tramite



# Create database tables (This is often done with Alembic in production)
# user_models.Base.metadata.create_all(bind=engine)
# (Call .create_all() on the Base that all your models inherit from)
app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await test_connection()

# Incluimos todos los routers
app.include_router(construir_tramite.router)
app.include_router(direcciones.router)
app.include_router(tramites.router)
app.include_router(requisitos_tramite.router)
app.include_router(pasos_tramite.router)
app.include_router(formularios_tramite.router)
app.include_router(usuarios.router)
app.include_router(interacciones.router)
app.include_router(prompts_bot.router)
app.include_router(login.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Martita IA"}