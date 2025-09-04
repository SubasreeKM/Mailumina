import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from .email_fetcher import fetch_emails
from .supabase_utils import REST_URL, HEADERS
from .rag import get_rag
import openai
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="AI Email Backend")


# -----------------------
# Existing Endpoints
# -----------------------

@app.post("/fetch-emails")
async def fetch_emails_now():
    try:
        fetch_emails()
        return {"status": "done"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching emails: {e}")


@app.post("/generate-draft/{email_id}")
async def generate_draft(email_id: int):
    url = REST_URL + f"?id=eq.{email_id}"
    try:
        r = requests.get(url, headers=HEADERS)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch email: {e}")

    if not data:
        raise HTTPException(status_code=404, detail="Email not found")

    email = data[0]

    rag = get_rag()
    contexts = rag.retrieve(email["body"])

    prompt = f"""Context:\n{contexts}\n
Customer email:\n{email['body']}\n
Write a professional empathetic reply under 200 words.
"""

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=350,
            temperature=0.2
        )
        draft = resp["choices"][0]["message"]["content"].strip()
    except Exception:
        draft = "Thanks for reaching out. We’re looking into your request."

    try:
        patch = requests.patch(url, headers=HEADERS, json={"draft": draft, "status": "drafted"})
        patch.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to update draft: {e}")

    return JSONResponse(content={"draft": draft})


# -----------------------
# New Endpoint: Send Reply
# -----------------------

@app.post("/send-reply/{email_id}")
def send_reply(email_id: int):
    # Fetch email from Supabase
    resp = requests.get(f"{REST_URL}?id=eq.{email_id}", headers=HEADERS)
    if resp.status_code != 200 or not resp.json():
        raise HTTPException(status_code=404, detail="Email not found")

    email_row = resp.json()[0]
    if not email_row.get("draft"):
        raise HTTPException(status_code=400, detail="No draft available to send")

    recipient = email_row["sender"]
    subject = f"Re: {email_row['subject']}"
    body = email_row["draft"]

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = recipient

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, [recipient], msg.as_string())

        # Update status in Supabase
        requests.patch(
            f"{REST_URL}?id=eq.{email_id}",
            headers=HEADERS,
            json={"status": "sent"}
        )

        return {"success": True, "message": f"Reply sent to {recipient}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
