from django.shortcuts import render
from rest_framework import generics
from .serializers import WatchlistSerializer, WatchlistItemSerializer
from .models import Watchlist
from rest_framework.views import APIView
from rest_framework.response import Response

class WatchlistView(generics.CreateAPIView):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer