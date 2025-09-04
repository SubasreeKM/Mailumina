from pydantic import BaseModel
from typing import Any, Optional

class EmailInDB(BaseModel):
    id: int
    message_id: str
    sender: str
    subject: str
    body: str
    received_at: str
    extracted: Optional[Any]
    sentiment: Optional[Any]
    priority_score: Optional[int]
    status: Optional[str]
    draft: Optional[str]
