# app/models/prompts_bot.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func # <-- Importamos func
from app.database import Base

class PromptsBot(Base):
    __tablename__ = "prompts_bot"

    id_prompt = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=True)
    tipo = Column(String(50), nullable=True)
    contenido = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now(), nullable=True)