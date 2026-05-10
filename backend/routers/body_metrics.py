from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from datetime import date

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.schemas.body_metric import BodyMetric as BodyMetricSchema, BodyMetricCreate
from backend.services import body_metric_service
from backend.services.exceptions import BodyMetricNotFound, PermissionDenied

router = APIRouter(tags=["Body Metrics"])

@router.get("/users/{userId}/body-metrics", response_model=list[BodyMetricSchema])
def list_body_metrics(
    userId: int,
    from_date: date | None = Query(default=None, alias="from"),
    to_date: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return body_metric_service.list_metrics(
            db=db,
            user_id=current_user.id,
            user_role=current_user.role,
            target_user_id=userId,
            from_date=from_date,
            to_date=to_date
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.post("/users/{userId}/body-metrics", response_model=BodyMetricSchema)
def create_body_metric(
    userId: int,
    payload: BodyMetricCreate,
    response: Response,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        metric, was_created = body_metric_service.create_metric(
            db=db,
            user_id=current_user.id,
            target_user_id=userId,
            payload=payload
        )
        response.status_code = status.HTTP_201_CREATED if was_created else status.HTTP_200_OK
        return metric
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.get("/users/{userId}/body-metrics/{metricId}", response_model=BodyMetricSchema)
def get_body_metric(
    userId: int,
    metricId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return body_metric_service.get_metric(
            db=db,
            metric_id=metricId,
            user_id=current_user.id,
            user_role=current_user.role,
            target_user_id=userId
        )
    except BodyMetricNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.put("/users/{userId}/body-metrics/{metricId}", response_model=BodyMetricSchema)
def update_body_metric(
    userId: int,
    metricId: int,
    payload: BodyMetricCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return body_metric_service.update_metric(
            db=db,
            metric_id=metricId,
            user_id=current_user.id,
            target_user_id=userId,
            payload=payload
        )
    except BodyMetricNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.delete("/users/{userId}/body-metrics/{metricId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_body_metric(
    userId: int,
    metricId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        body_metric_service.delete_metric(
            db=db,
            metric_id=metricId,
            user_id=current_user.id,
            user_role=current_user.role,
            target_user_id=userId
        )
    except BodyMetricNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
