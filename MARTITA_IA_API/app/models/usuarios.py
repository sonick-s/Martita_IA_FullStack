from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class Usuarios(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    email = Column(String(150))
    password = Column(String(255), nullable=False)
    estado = Column(Integer, nullable=True, default=1)
    fecha_registro = Column(DateTime, nullable=True)
