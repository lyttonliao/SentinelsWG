from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
                                        PermissionsMixin
from django.conf import settings


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)


        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class Ticker(models.Model):
    """List of tickers that will reference watchlistitems and stockinfo"""
    symbol = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.symbol


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True, default=None)
    last_name = models.CharField(max_length=255, null=True, blank=True, default=None)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    tickers = models.ManyToManyField(Ticker, through='WatchlistItem')

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class WatchlistItem(models.Model):
    """List of information to show when adding item to Watchlist"""
    user = models.ForeignKey(
        User,
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
        return self.ticker.symbol


class TickerHistoricInfo(models.Model):
    """Stores years of stock info for strategic testing"""
    ticker = models.ForeignKey(
        Ticker,
        related_name='ticker_historic_info',
        on_delete=models.CASCADE,
    )
    date = models.DateField(max_length=10)
    open_price = models.DecimalField(max_digits=8, decimal_places=2)
    high_price = models.DecimalField(max_digits=8, decimal_places=2)
    low_price = models.DecimalField(max_digits=8, decimal_places=2)
    close_price = models.DecimalField(max_digits=8, decimal_places=2)
    volume = models.IntegerField()

    def __str__(self):
        return self.ticker.symbol
