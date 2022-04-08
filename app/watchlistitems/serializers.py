from django.utils.translation import gettext_lazy as _
from core.models import WatchlistItem
from rest_framework import serializers

        
class WatchlistItemSerializer(serializers.ModelSerializer):
    """Serializer for watchlist item objects - stocks"""

    user = serializers.ReadOnlyField(source='user.email')
    symbol = serializers.ReadOnlyField(source='ticker.symbol')
    company = serializers.ReadOnlyField(source='ticker.company')
    class Meta:
        model = WatchlistItem
        fields = ('id', 'user', 'ticker', 'symbol', 'company')
        read_only_fields = ('id',)
