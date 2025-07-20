from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class Interacciones(Base):
    __tablename__ = "interacciones"

    id_interaccion = Column(Integer, primary_key=True, index=True)
    pregunta = Column(Text, nullable=True)
    respuesta = Column(Text, nullable=True)
    respuesta_util = Column(String, default=None, nullable=True)  # like o dislike
    fecha = Column(DateTime, nullable=True)
