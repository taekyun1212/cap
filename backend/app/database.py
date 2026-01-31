from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_URL = "mysql+pymysql://admin:00000000@database-1.cno4c0skmxe1.ap-northeast-2.rds.amazonaws.com:3306/mydb"

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()