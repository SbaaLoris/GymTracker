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