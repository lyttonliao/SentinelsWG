from rest_framework.routers import DefaultRouter

from watchlistitems import views


router = DefaultRouter()
router.register(r'watchlistitems', views.WatchlistItemViewSet)
