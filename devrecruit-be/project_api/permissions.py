from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to create, update, and delete projects.
    Regular users can only view the projects assigned to them.
    """
    def has_permission(self, request, view):
        # If the request method is safe (GET, HEAD, OPTIONS), allow all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Otherwise, only allow access to admins
        return request.user.is_staff
