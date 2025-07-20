from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class FormulariosTramite(Base):
    __tablename__ = "formularios_tramite"

    id_formulario = Column(Integer, primary_key=True, index=True)
    id_tramite = Column(Integer, ForeignKey("tramites.id_tramite", ondelete="CASCADE"), nullable=True)
    nombre = Column(String(255), nullable=True)
    url = Column(Text, nullable=True)
    contexto = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=True)

    tramite = relationship("Tramites", back_populates="formularios")
