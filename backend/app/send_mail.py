import smtplib, os
from email.message import EmailMessage

SMTP_HOST = os.getenv("SMTP_HOST","smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT",587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

def send_email(to_email, subject, body_text):
    msg = EmailMessage()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body_text)
    s = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    s.starttls()
    s.login(SMTP_USER, SMTP_PASS)
    s.send_message(msg)
    s.quit()
    return True
