from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class RequisitosTramite(Base):
    __tablename__ = "requisitos_tramite"

    id_requisito = Column(Integer, primary_key=True, index=True)
    id_tramite = Column(Integer, ForeignKey("tramites.id_tramite", ondelete="CASCADE"), nullable=True)
    contexto = Column(Text, nullable=True)
    requisito = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=True)

    tramite = relationship("Tramites", back_populates="requisitos")
