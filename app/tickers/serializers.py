from rest_framework import serializers

from core.models import Ticker, TickerHistoricInfo, WatchlistItem


class TickerSerializer(serializers.ModelSerializer):
    """Serializer for tickers"""
    watchlistitems = serializers.SlugRelatedField(
        many=True,
        slug_field='symbol',
        queryset=WatchlistItem.objects.all()
    )
    tickerHistoricInfo = serializers.SlugRelatedField(
        many=True,
        slug_field='ticker',
        queryset=TickerHistoricInfo.objects.all()
    )

    class Meta:
        model = Ticker
        fields = ('id', 'symbol')


class TickerHistoricInfoSerializer(serializers.ModelSerializer):
    """Serializer for ticker historic info"""

    class Meta:
        model = TickerHistoricInfo
        fields = '__all__'
        depth = 1
