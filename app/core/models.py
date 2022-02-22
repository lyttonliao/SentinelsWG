from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
                                        PermissionsMixin
from django.conf import settings
# from django.db.models.signals import post_save
# from django.dispatch import receiver


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(sender, instance=None, created=False, **kwargs):
#     if created:
#         Token.objects.create(user=instance)

        
class Watchlist(models.Model):
    """Create watchlist to track the commodity"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class Ticker(models.Model):
    """List of tickers that will reference watchlistitems and stockinfo"""
    symbol = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.symbol


class WatchlistItem(models.Model):
    """List of information to show when adding item to Watchlist"""
    watchlist = models.ForeignKey(
        Watchlist,
        related_name='watchlistitems',
        on_delete=models.CASCADE
    )
    ticker = models.ForeignKey(
        Ticker,
        related_name='watchlistitems',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.symbol


class TickerHistoricInfo(models.Model):
    """Stores years of stock info for strategic testing"""
    ticker = models.ForeignKey(
        Ticker,
        on_delete=models.CASCADE,
    )
    date = models.CharField(max_length=10)
    open_price = models.DecimalField(max_digits=8, decimal_places=2)
    high_price = models.DecimalField(max_digits=8, decimal_places=2)
    low_price = models.DecimalField(max_digits=8, decimal_places=2)
    close_price = models.DecimalField(max_digits=8, decimal_places=2)
    volume = models.IntegerField()

    def __str__(self):
        return self.ticker.symbol
