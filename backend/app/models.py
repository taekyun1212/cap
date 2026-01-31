from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
import datetime

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    url = Column(String(500))
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="uploaded")  # 상태: uploaded, failed, done, etc.
    transcript_url = Column(String(1000))  # ✅ S3에 저장된 텍스트 URL

    
    
