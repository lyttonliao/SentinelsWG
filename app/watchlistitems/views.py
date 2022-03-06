from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


from core.models import WatchlistItem
from .serializers import WatchlistItemSerializer       


class WatchlistItemViewSet(viewsets.ModelViewSet):
    """Manage Watchlist Items in the database"""
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchlistItemSerializer
    queryset = WatchlistItem.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
