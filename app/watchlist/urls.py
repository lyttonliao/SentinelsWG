from django.urls import path, include
from rest_framework.routers import DefaultRouter

from watchlist import views


router = DefaultRouter()
router.register(r'watchlists', views.WatchlistViewSet)
router.register(r'watchlistitems', views.WatchlistItemViewSet)


urlpatterns = [
    path('', include(router.urls))
]
