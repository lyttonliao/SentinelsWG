from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from core.models import Ticker, TickerHistoricInfo
from .serializers import TickerSerializer, TickerHistoricInfoSerializer


class TickerViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    """Manages tickers in the database"""
    permission_classes = (IsAuthenticated,)
    serializer_class = TickerSerializer
    queryset = Ticker.objects.all()


class TickerHistoricInfoViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                mixins.DestroyModelMixin,
                                viewsets.GenericViewSet):
    """Manages historic data for tickers"""
    permission_classes = (IsAuthenticated,)
    serializer_class = TickerHistoricInfoSerializer
    queryset = TickerHistoricInfo.objects.all()
