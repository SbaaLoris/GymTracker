import csv
import io
from datetime import date
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from backend.models.body_metric import BodyMetric
from backend.models.workout_session import WorkoutSession

def generate_body_metrics_csv(metrics: list[BodyMetric]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Body Weight (kg)"])
    for m in metrics:
        writer.writerow([m.date.isoformat(), m.body_weight])
    return output.getvalue()

def generate_body_metrics_pdf(metrics: list[BodyMetric], username: str) -> bytes:
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, f"Body Metrics History: {username}")
    
    # Header
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, height - 80, "Date")
    p.drawString(250, height - 80, "Weight (kg)")
    p.line(100, height - 85, 500, height - 85)

    # Data
    y = height - 105
    p.setFont("Helvetica", 12)
    for m in metrics:
        if y < 50:  # New page
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 12)
        
        p.drawString(100, y, m.date.isoformat())
        p.drawString(250, y, str(m.body_weight))
        y -= 20

    p.save()
    return buffer.getvalue()

def generate_workout_sessions_csv(sessions: list[WorkoutSession], exercises_by_id: dict) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Exercise", "Type", "Reps", "Weight (kg)", "Duration (s)"])
    for s in sessions:
        for st in s.sets:
            ex_name = exercises_by_id.get(st.exercise_id, "Unknown Exercise")
            writer.writerow([s.date.isoformat(), ex_name, st.type, st.reps or "", st.weight or "", st.duration or ""])
    return output.getvalue()

def generate_workout_sessions_pdf(sessions: list[WorkoutSession], exercises_by_id: dict, username: str) -> bytes:
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, f"Workout Sessions History: {username}")
    
    # Header
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, height - 80, "Date")
    p.drawString(200, height - 80, "Exercise")
    p.drawString(350, height - 80, "Metrics")
    p.line(100, height - 85, 500, height - 85)

    # Data
    y = height - 105
    p.setFont("Helvetica", 12)
    
    for s in sessions:
        if y < 50:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 12)
            
        p.setFont("Helvetica-Bold", 12)
        p.drawString(100, y, s.date.isoformat())
        y -= 20
        p.setFont("Helvetica", 12)
        
        for st in s.sets:
            if y < 50:
                p.showPage()
                y = height - 50
                p.setFont("Helvetica", 12)
                
            ex_name = exercises_by_id.get(st.exercise_id, "Unknown Exercise")
            p.drawString(200, y, ex_name)
            if st.type == "cardio":
                metrics_str = f"Duration: {st.duration}s"
            else:
                metrics_str = f"Reps: {st.reps}, Weight: {st.weight}kg"
            p.drawString(350, y, metrics_str)
            y -= 20
        y -= 10 # extra padding between sessions

    p.save()
    return buffer.getvalue()
