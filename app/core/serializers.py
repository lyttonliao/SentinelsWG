from rest_framework import serializers
from .models import Watchlist, WatchlistItem

class WatchlistSerializer(serializers.ModelSerializer):
    """Serializer for watchlist objects"""

    watchlistitems= serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=WatchlistItem.objects.all()
    )
    class Meta:
        model = Watchlist
        fields = ('id', 'user', 'created_at')
        read_only_fields = ('id',)


class WatchlistItemSerializer(serializers.ModelSerializer):
    """Serializer for watchlist item objects - coins"""

    class Meta:
        model = WatchlistItem
        fields = ('coin', 'price', 'open_price', 'close_price', 'high_price', 'low_price', 'market_cap', 'daily_volume', 'watchlist')
        read_only_fields = ('id',)
