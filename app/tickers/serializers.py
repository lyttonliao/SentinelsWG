from rest_framework import serializers

from core.models import Ticker, TickerHistoricInfo
from watchlistitems.serializers import WatchlistItemSerializer


class TickerHistoricInfoSerializer(serializers.ModelSerializer):
    """Serializer for ticker historic info"""

    ticker = serializers.ReadOnlyField(source='ticker.symbol')
    class Meta:
        model = TickerHistoricInfo
        fields = ('id', 'ticker', 'date', 'open_price', 'close_price', 'high_price', 'low_price', 'volume')
        depth = 1


class TickerSerializer(serializers.ModelSerializer):
    """Serializer for tickers"""
    watchlistitems = WatchlistItemSerializer(
        many=True,
        read_only=True,
    )
    ticker_historic_info = serializers.PrimaryKeyRelatedField(
        many=True, 
        read_only=True
    )

    class Meta:
        model = Ticker
        fields = ('id', 'symbol', 'watchlistitems', 'ticker_historic_info')
