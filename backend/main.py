import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from bot import send_telegram_message

app = FastAPI()
# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect("database.sqlite")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            rating INTEGER NOT NULL,
            experience TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Pydantic model for validation
class Feedback(BaseModel):
    name: str
    email: str
    rating: int
    experience: str

@app.post("/feedback")
def submit_feedback(feedback: Feedback):
    try:
        # 1. Store feedback in SQLite
        conn = sqlite3.connect("database.sqlite")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO feedbacks (name, email, rating, experience) VALUES (?, ?, ?, ?)",
            (feedback.name, feedback.email, feedback.rating, feedback.experience)
        )
        conn.commit()
        conn.close()

        # 2. Send Telegram Notification
        send_telegram_message(feedback.dict())

        return {"success": True, "message": "Feedback submitted successfully"}
    except Exception as e:
        print(f"Error processing feedback: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/feedbacks")
def get_feedbacks():
    try:
        conn = sqlite3.connect("database.sqlite")
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, rating, experience FROM feedbacks ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()

        feedbacks = [
            {"id": row[0], "name": row[1], "email": row[2], "rating": row[3], "experience": row[4], "timestamp": "N/A"}
            for row in rows
        ]
        return {"feedbacks": feedbacks}
    except Exception as e:
        print(f"Error fetching feedbacks: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Mount the static files directory to serve the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")
