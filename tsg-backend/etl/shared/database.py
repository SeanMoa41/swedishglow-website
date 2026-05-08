from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from etl.shared.config import DATABASE_URL_SYNC

engine = create_engine(DATABASE_URL_SYNC)
SessionLocal = sessionmaker(bind=engine)
