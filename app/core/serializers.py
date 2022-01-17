from rest_framework import serializers
from .models import Watchlist

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ('id', 'coin', 'price', 'open_price', 'close_price', 'low_price', 'high_price', 'market_cap', 'daily_volume', 'user', 'created_at')