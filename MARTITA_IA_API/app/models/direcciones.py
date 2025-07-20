from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.orm import relationship

class Direcciones(Base):
    __tablename__ = "direcciones"

    id_direcciones = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=True)
    descripcion = Column(Text, nullable=True)
    responsable = Column(String(150), nullable=True)
    correo_responsable = Column(String(150), nullable=True)
    telefono = Column(String(100), nullable=True)
    estado = Column(Integer, default=1, nullable=True)
    fecha_actualizacion = Column(Date, nullable=True)

    tramites = relationship("Tramites", back_populates="direccion")
