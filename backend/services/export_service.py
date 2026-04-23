import csv
import io
from datetime import date
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from backend.models.body_metric import BodyMetric

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
