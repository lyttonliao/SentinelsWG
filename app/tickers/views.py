from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from core.models import Ticker, TickerHistoricInfo
from .serializers import TickerSerializer, TickerHistoricInfoSerializer


class TickerViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):
    """Manages tickers in the database"""
    serializer_class = TickerSerializer
    queryset = Ticker.objects.all()


class TickerHistoricInfoViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                viewsets.GenericViewSet):
    """Manages historic data for tickers"""
    serializer_class = TickerHistoricInfoSerializer


    def get_queryset(self):
        ticker = self.request.query_params.get('ticker', None)
        latest = self.request.query_params.get('latest', None)
        queryset = TickerHistoricInfo.objects.all()
        if ticker:
            queryset = queryset.filter(ticker__symbol=ticker)
        if latest:
            queryset = [queryset.latest('date')]
        return queryset