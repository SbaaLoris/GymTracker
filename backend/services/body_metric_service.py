from sqlalchemy.orm import Session
from datetime import date
from backend.models.body_metric import BodyMetric
from backend.schemas.body_metric import BodyMetricCreate
from backend.services.exceptions import BodyMetricNotFound, PermissionDenied
from backend.models.role import RoleEnum

def _get_metric_or_raise(db: Session, metric_id: int, target_user_id: int) -> BodyMetric:
    metric = db.query(BodyMetric).filter(
        BodyMetric.id == metric_id,
        BodyMetric.user_id == target_user_id
    ).first()
    if metric is None:
        raise BodyMetricNotFound(f"Body metric {metric_id} not found for user {target_user_id}")
    return metric

def list_metrics(
    db: Session, 
    user_id: int, 
    user_role: RoleEnum, 
    target_user_id: int,
    from_date: date | None = None,
    to_date: date | None = None
) -> list[BodyMetric]:
    # Check if current user is allowed to view target_user_id's metrics
    if user_role != RoleEnum.ADMIN and user_id != target_user_id:
        raise PermissionDenied("You can only view your own body metrics")
    
    query = db.query(BodyMetric).filter(BodyMetric.user_id == target_user_id)
    
    if from_date:
        query = query.filter(BodyMetric.date >= from_date)
    if to_date:
        query = query.filter(BodyMetric.date <= to_date)
        
    return query.order_by(BodyMetric.date.desc()).all()

def get_metric(db: Session, metric_id: int, user_id: int, user_role: RoleEnum, target_user_id: int) -> BodyMetric:
    if user_role != RoleEnum.ADMIN and user_id != target_user_id:
        raise PermissionDenied("You do not have permission to access this user's metrics")
        
    return _get_metric_or_raise(db, metric_id, target_user_id)

def create_metric(db: Session, user_id: int, target_user_id: int, payload: BodyMetricCreate) -> BodyMetric:
    # POST /users/{userId}/body-metrics is "Owner only" as per spec
    if user_id != target_user_id:
        raise PermissionDenied("You can only log body metrics for yourself")
        
    existing = db.query(BodyMetric).filter_by(user_id=user_id, date=payload.date).first()
    if existing:
        existing.body_weight = payload.body_weight
        db.commit()
        db.refresh(existing)
        return existing

    new_metric = BodyMetric(
        user_id=user_id,
        date=payload.date,
        body_weight=payload.body_weight
    )
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    return new_metric

def update_metric(db: Session, metric_id: int, user_id: int, target_user_id: int, payload: BodyMetricCreate) -> BodyMetric:
    # PUT /users/{userId}/body-metrics/{metricId} is "Owner only" as per spec
    if user_id != target_user_id:
        raise PermissionDenied("You can only update your own body metrics")
        
    metric = _get_metric_or_raise(db, metric_id, target_user_id)
    
    metric.date = payload.date
    metric.body_weight = payload.body_weight
    
    db.commit()
    db.refresh(metric)
    return metric

def delete_metric(db: Session, metric_id: int, user_id: int, user_role: RoleEnum, target_user_id: int) -> None:
    # DELETE /users/{userId}/body-metrics/{metricId} is "Owner or Admin"
    if user_role != RoleEnum.ADMIN and user_id != target_user_id:
        raise PermissionDenied("You do not have permission to access this user's metrics")
        
    metric = _get_metric_or_raise(db, metric_id, target_user_id)

    db.delete(metric)
    db.commit()
