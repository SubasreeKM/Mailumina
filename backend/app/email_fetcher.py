import imaplib, email, os, time
from email.header import decode_header
from .nlp_utils import extract_info, analyze_sentiment_priority
from .supabase_utils import insert_email_if_new

IMAP_HOST = os.getenv("IMAP_HOST")
IMAP_USER = os.getenv("IMAP_USER")
IMAP_PASS = os.getenv("IMAP_PASS")

def decode_subj(s):
    if not s:
        return ""
    t = decode_header(s)[0][0]
    if isinstance(t, bytes):
        return t.decode(errors="ignore")
    return str(t)

def fetch_emails(limit=20):
    """Fetch last `limit` emails from inbox and insert into Supabase."""
    try:
        m = imaplib.IMAP4_SSL(IMAP_HOST)
        m.login(IMAP_USER, IMAP_PASS)
        m.select("inbox")

        status, data = m.search(None, "ALL")
        if status != "OK":
            print("❌ Failed to search inbox")
            return []

        ids = data[0].split()
        latest_ids = ids[-limit:]  # last N emails
        results = []

        for id in latest_ids:
            typ, msg_data = m.fetch(id, "(RFC822)")
            if typ != "OK":
                continue

            msg = email.message_from_bytes(msg_data[0][1])
            subj = decode_subj(msg.get("Subject"))
            sender = msg.get("From")
            message_id = msg.get("Message-ID") or f"<{time.time()}@local>"
            date = msg.get("Date")

            # Extract plain text body
            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain" and not part.get("Content-Disposition"):
                        body = part.get_payload(decode=True).decode(errors="ignore")
                        break
            else:
                try:
                    body = msg.get_payload(decode=True).decode(errors="ignore")
                except:
                    body = ""

            extracted = extract_info(body)
            sentiment, priority_score = analyze_sentiment_priority(body)

            row = {
                "message_id": message_id,
                "sender": sender,
                "subject": subj,
                "body": body,
                "received_at": date,
                "extracted": extracted,
                "sentiment": sentiment,
                "priority_score": priority_score,
                "status": "pending"
            }

            inserted = insert_email_if_new(row)
            if inserted:
                print(f"✅ Inserted: {subj}")
                results.append(inserted)
            else:
                print(f"⚠️ Skipped duplicate: {subj}")

        m.logout()
        return results

    except Exception as e:
        print("❌ Error fetching emails:", e)
        return []
