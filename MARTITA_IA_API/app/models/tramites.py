from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Tramites(Base):
    __tablename__ = "tramites"

    id_tramite = Column(Integer, primary_key=True, index=True)
    id_direcciones = Column(Integer, ForeignKey("direcciones.id_direcciones"), nullable=True)
    nombre = Column(String(255), nullable=True)
    descripcion = Column(Text, nullable=True)
    contexto = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=True)
    fecha_registro = Column(DateTime, nullable=True)

    direccion = relationship("Direcciones", back_populates="tramites")
    requisitos = relationship("RequisitosTramite", back_populates="tramite", cascade="all, delete")
    pasos = relationship("PasosTramite", back_populates="tramite", cascade="all, delete")
    formularios = relationship("FormulariosTramite", back_populates="tramite", cascade="all, delete")
