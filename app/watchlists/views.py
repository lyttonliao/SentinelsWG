from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from django.db.models.signals import post_save
from django.dispatch import receiver


from core.models import User, Watchlist, WatchlistItem
from .serializers import WatchlistSerializer, WatchlistItemSerializer       


class WatchlistViewSet(mixins.CreateModelMixin, 
                       mixins.ListModelMixin, 
                       mixins.RetrieveModelMixin, 
                       viewsets.GenericViewSet):
    """Manage watchlists in the database"""
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchlistSerializer
    queryset = Watchlist.objects.all()

    @receiver(post_save, sender=User)
    def create(sender, instance, created, **kwargs):
        if created:
            Watchlist.objects.create(user=instance)


class WatchlistItemViewSet(viewsets.ModelViewSet):
    """Manage Watchlist Items in the database"""
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchlistItemSerializer
    queryset = WatchlistItem.objects.all()

    def perform_create(self, serializer):
        serializer.save(watchlist=self.request.user.watchlist)
