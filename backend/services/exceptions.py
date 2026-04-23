class DomainError(Exception):
    """Base class for all domain (business-rule) errors."""


class PendingRequestLimitReached(DomainError):
    """User has too many pending exercise requests."""


class RequestNotFound(DomainError):
    """Exercise request does not exist."""


class RequestNotPending(DomainError):
    """Action requires the request to be in 'pending' status."""


class PermissionDenied(DomainError):
    """The current user is not allowed to perform this action."""


class ExerciseNotFound(DomainError):
    """Exercise does not exist."""


class ExerciseNameConflict(DomainError):
    """Another exercise with the same name already exists."""


class PlanNotFound(DomainError):
    """Workout plan does not exist."""


class InactiveExerciseInPlan(DomainError):
    """Cannot reference an inactive (soft-deleted) exercise in a plan."""


class DuplicateOrderIndex(DomainError):
    """The same order_index appears twice in the same plan."""


class CardioExerciseInPlan(DomainError):
    """Cardio exercises cannot be added to workout plans."""


class SessionNotFound(DomainError):
    """Workout session does not exist."""


class ExerciseTypeMismatch(DomainError):
    """Set type (strength/cardio) does not match the exercise's is_cardio flag."""


class PlanNotVisible(DomainError):
    """The referenced plan exists but the user is not allowed to use it."""


class UsernameConflict(DomainError):
    """Another user with the same username already exists."""


class InvalidCredentials(DomainError):
    """Username or password is incorrect."""
