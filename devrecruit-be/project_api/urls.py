from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterAndLoginUserView, RegisterAdminUserView, ProjectViewSet,ViewUsers

# Create a router and register the ProjectViewSet
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

urlpatterns = [
    path('register/', RegisterAndLoginUserView.as_view(), name='register'),
    path('view-users/', ViewUsers.as_view(), name='view-users'),
    path('', include(router.urls)),  # Include the router URLs
]
