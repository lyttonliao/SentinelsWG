from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tickers import views


router = DefaultRouter()
router.register(r'tickers', views.TickerViewSet, basename='tickers')
router.register(r'tickerhistoricinfo', views.TickerHistoricInfoViewSet, basename='tickerhistoricinfo')
