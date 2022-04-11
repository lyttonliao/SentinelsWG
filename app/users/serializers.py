from django.contrib.auth import get_user_model

from rest_framework import serializers
from watchlistitems.serializers import WatchlistItemSerializer
from tickers.serializers import TickerSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(
        required=True,
        max_length=255
    )
    last_name = serializers.CharField(
        required=True,
        max_length=255
    )

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['first_name'] = self.validated_data.get('first_name', '')
        data_dict['last_name'] = self.validated_data.get('last_name', '')
        return data_dict


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the users object"""

    watchlistitems = WatchlistItemSerializer(
        many=True,
        read_only=True
    )
    tickers = TickerSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'first_name',
                 'last_name', 'watchlistitems', 'tickers'
                )
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}
        depth = 2

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""

        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user, setting the password correclty and return it"""

        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['name'] = user.first_name + ' ' + user.last_name
        return token
