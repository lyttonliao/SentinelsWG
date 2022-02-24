from django.utils.translation import gettext_lazy as _
from core.models import Watchlist, WatchlistItem
from rest_framework import serializers


class WatchlistSerializer(serializers.ModelSerializer):
    """Serializer for watchlist objects"""
    
    user = serializers.ReadOnlyField(source='user.email')
    watchlistitems = serializers.SlugRelatedField(
        many=True,
        slug_field='symbol',
        queryset=WatchlistItem.objects.all()
    )
    class Meta:
        model = Watchlist
        fields = ('user', 'watchlistitems')
        read_only_fields = ('user',)

        
class WatchlistItemSerializer(serializers.ModelSerializer):
    """Serializer for watchlist item objects - stocks"""

    class Meta:
        model = WatchlistItem
        fields = ('id', 'symbol', 'watchlist', 'ticker')
        read_only_fields = ('id',)
