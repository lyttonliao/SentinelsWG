from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models import User
from users.serializers import UserSerializer, MyTokenObtainPairSerializer, CustomRegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from dj_rest_auth.registration.views import RegisterView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """Viewset to Create, List, Retrieve, Delete User"""
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer
