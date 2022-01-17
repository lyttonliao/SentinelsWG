from django.shortcuts import render
from rest_framework import generics
from .serializers import WatchlistSerializer
from .models import Watchlist


class WatchlistView(generics.CreateAPIView):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer