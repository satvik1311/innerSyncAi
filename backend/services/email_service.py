import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

async def send_goal_failure_email(to_email: str, goal_title: str):
    """
    Sends an email to the user notifying them that their goal has expired based on its deadline.
    """
    subject = f"Action Required: Your Goal '{goal_title}' has Expired"
    body = f"""Hello,

This is an automated message from the AI Memory Vault.

Unfortunately, the deadline for your goal "{goal_title}" has passed without completion. 
Your Future Self encourages you not to give up! You can always log into your dashboard, establish a new timeline, and try again.

Best,
AI Memory Vault System
"""

    # If SMTP credentials aren't set, log to console for dev testing
    if not SMTP_USER or not SMTP_PASS:
        print("\n" + "="*50)
        print(f"📧 [MOCK EMAIL DISPATCHED]")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print("-" * 50)
        print(body)
        print("="*50 + "\n")
        return

    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_USER
        msg['To'] = to_email

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            
        print(f"Email successfully dispatched to {to_email} for goal '{goal_title}'")
    except Exception as e:
        print(f"Failed to send email to {to_email}. Error: {e}")

async def send_task_reminder_email(to_email: str, goal_title: str, task_text: str):
    """
    Sends an email to the user notifying them that a sub-task deadline has expired.
    """
    subject = f"Friendly Reminder: Action needed for '{goal_title}'"
    body = f"""Hello,

This is an automated prompt from your AI Future Self.

You missed the deadline for a specific step toward your goal "{goal_title}".
Pending Task: {task_text}

Don't let it slip entirely! Log in and check it off as soon as you have completed it.

Best,
AI Memory Vault System
"""

    if not SMTP_USER or not SMTP_PASS:
        print("\n" + "="*50)
        print(f"📧 [MOCK TASK REMINDER DISPATCHED]")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print("-" * 50)
        print(body)
        print("="*50 + "\n")
        return

    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_USER
        msg['To'] = to_email

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            
        print(f"Reminder successfully dispatched to {to_email} for task '{task_text[:15]}...'")
    except Exception as e:
        print(f"Failed to send task reminder email to {to_email}. Error: {e}")
