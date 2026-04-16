import asyncio
import os
import sys

from dotenv import load_dotenv
sys.path.append(os.path.join(os.getcwd()))

# Force load from current directory
load_dotenv(dotenv_path=".env")

from services.email_service import send_task_reminder_email, SMTP_USER, SMTP_PASS

async def test_email():
    target_email = "satvik.gaur12@gmail.com"
    print(f"SMTP_USER found: {bool(SMTP_USER)}")
    print(f"SMTP_PASS found: {bool(SMTP_PASS)}")
    print(f"Attempting to send test synchronization email to: {target_email}")
    
    await send_task_reminder_email(
        to_email=target_email,
        goal_title="Neural Sync Test",
        task_text="Establish connection with InnerSync AI"
    )
    print("\nTest sequence complete. Check the console output above to see if it was 'MOCKED' or 'DISPATCHED'.")

if __name__ == "__main__":
    asyncio.run(test_email())
