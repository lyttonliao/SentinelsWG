from django.urls import path
from .views import WatchlistView

urlpatterns = [
    path('watchlist', WatchlistView.as_view())
]