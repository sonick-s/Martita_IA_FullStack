from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class PasosTramite(Base):
    __tablename__ = "pasos_tramite"

    id_paso = Column(Integer, primary_key=True, index=True)
    id_tramite = Column(Integer, ForeignKey("tramites.id_tramite", ondelete="CASCADE"), nullable=True)
    contexto = Column(Text, nullable=True)
    paso = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=True)

    tramite = relationship("Tramites", back_populates="pasos")
