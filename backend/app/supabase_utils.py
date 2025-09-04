import os
import requests
from dotenv import load_dotenv

load_dotenv()  # This loads variables from .env

SUPABASE_URL = os.getenv("SUPABASE_URL")
if SUPABASE_URL is None:
    raise ValueError("SUPABASE_URL is not set in environment variables.")

REST_URL = SUPABASE_URL.rstrip("/") + "/rest/v1/emails"

SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if SERVICE_KEY is None:
    raise ValueError("SUPABASE_SERVICE_KEY is not set in environment variables.")

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def insert_email_if_new(row):
    # check by message_id
    query = {"message_id": f"eq.{row['message_id']}"}
    r = requests.get(REST_URL, headers=HEADERS, params=query)
    if r.status_code == 200 and r.json():
        return None
    resp = requests.post(REST_URL, headers=HEADERS, json=[row])
    resp.raise_for_status()
    return resp.json()
