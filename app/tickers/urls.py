from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tickers import views


router = DefaultRouter()
router.register(r'ticker', views.TickerViewSet)
router.register(r'tickerhistoricinfo', views.TickerHistoricInfoViewSet)
