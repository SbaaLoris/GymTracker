from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import date
from typing import Literal
import io

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.services import body_metric_service, export_service, workout_session_service
from backend.models.exercise import Exercise
from backend.services.exceptions import PermissionDenied

router = APIRouter(prefix="/users/{userId}/export", tags=["Export"])

@router.get("/body-metrics")
def export_body_metrics(
    userId: int,
    format: Literal["csv", "pdf"],
    from_date: date | None = Query(default=None, alias="from"),
    to_date: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    # Re-use the existing service logic which already handles Owner or Admin checks
    try:
        metrics = body_metric_service.list_metrics(
            db=db,
            user_id=current_user.id,
            user_role=current_user.role,
            target_user_id=userId,
            from_date=from_date,
            to_date=to_date
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

    if format.lower() == "csv":
        csv_content = export_service.generate_body_metrics_csv(metrics)
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=body_metrics_{userId}.csv"}
        )
    else:  # format must be pdf due to Literal
        pdf_content = export_service.generate_body_metrics_pdf(metrics, current_user.username if current_user.id == userId else f"User {userId}")
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=body_metrics_{userId}.pdf"}
        )

@router.get("/workout-sessions")
def export_workout_sessions(
    userId: int,
    format: Literal["csv", "pdf"],
    from_date: date | None = Query(default=None, alias="from"),
    to_date: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        sessions = workout_session_service.list_sessions(
            db=db,
            path_user_id=userId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            from_date=from_date,
            to_date=to_date
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

    # Fetch all exercises to map IDs to names
    exercises = db.query(Exercise).all()
    exercises_by_id = {ex.id: ex.name for ex in exercises}

    if format.lower() == "csv":
        csv_content = export_service.generate_workout_sessions_csv(sessions, exercises_by_id)
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=workout_sessions_{userId}.csv"}
        )
    else:  # format must be pdf due to Literal
        pdf_content = export_service.generate_workout_sessions_pdf(sessions, exercises_by_id, current_user.username if current_user.id == userId else f"User {userId}")
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=workout_sessions_{userId}.pdf"}
        )
