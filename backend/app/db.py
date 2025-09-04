import os
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text, JSON, DateTime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./emails.db")

metadata = MetaData()

emails = Table(
    "emails", metadata,
    Column("id", Integer, primary_key=True),
    Column("message_id", String, unique=True),
    Column("sender", String),
    Column("subject", String),
    Column("body", Text),
    Column("received_at", String),
    Column("extracted", JSON),
    Column("sentiment", JSON),
    Column("priority_score", Integer, default=0),
    Column("status", String, default="pending"),
    Column("draft", Text, default=None)
)

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL.replace("+aiosqlite",""))
metadata.create_all(engine)
