from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import SessionLocal
from backend.models.body_metric import BodyMetric
from backend.schemas.body_metric import BodyMetricOut, BodyMetricCreate, BodyMetricUpdate, BodyMetricDelete

router = APIRouter()

# Dependency logic to provide a clean database session for each request.
# The session is automatically closed after the request is completed.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET endpoint to retrieve all body metrics.
# Used for fetching and displaying previously saved entries (e.g., in a chart).
@router.get("/body-metrics", response_model=List[BodyMetricOut])
def read_body_metrics(db: Session = Depends(get_db)):
    metrics = db.query(BodyMetric).order_by(BodyMetric.date.asc()).all()
    return metrics

# POST endpoint for creating a new body metric entry.
# Pydantic validates the incoming payload using the BodyMetricCreate schema.
@router.post("/body-metrics", response_model=BodyMetricOut)
def create_body_metric(metric: BodyMetricCreate, db: Session = Depends(get_db)):
    # Converts the validated Pydantic input into a dictionary to instantiate the ORM model
    db_metric = BodyMetric(**metric.model_dump())
    # Prepares the new object for insertion into the database
    db.add(db_metric)
    # Saves the entry permanently to the database
    db.commit()
    # Reloads the saved object to get auto-generated properties like the ID
    db.refresh(db_metric)
    # Returns the created entry back to the client
    return db_metric

# PUT endpoint to update an existing body metric.
# Used when the user edits a past entry.
@router.put("/body-metrics", response_model=BodyMetricOut)
def update_body_metric(metric: BodyMetricUpdate, db: Session = Depends(get_db)):
    db_metric = db.query(BodyMetric).filter(BodyMetric.id == metric.id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Body metric not found")
    
    db_metric.date = metric.date
    db_metric.body_weight = metric.body_weight
    
    db.commit()
    db.refresh(db_metric)
    return db_metric

# DELETE endpoint to remove an existing body metric.
# Accepts a JSON body containing the ID of the metric to delete.
@router.delete("/body-metrics")
def delete_body_metric(metric: BodyMetricDelete, db: Session = Depends(get_db)):
    db_metric = db.query(BodyMetric).filter(BodyMetric.id == metric.id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Body metric not found")
    
    # Removes the object from the database context
    db.delete(db_metric)
    db.commit()
    return {"message": "Body metric deleted successfully"}
