from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from users import views

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
