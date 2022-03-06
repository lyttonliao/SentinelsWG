from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings

from rest_framework.routers import DefaultRouter
from tickers.urls import router as tickerRouter
from users.urls import router as userRouter
from watchlistitems.urls import router as watchlistItemRouter
from users.views import MyTokenObtainPairView

from rest_framework_simplejwt.views import TokenRefreshView
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView, ConfirmEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

router = DefaultRouter()
appRouters = (tickerRouter, userRouter, watchlistItemRouter)

for appRouter in appRouters:
    router.registry.extend(appRouter.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'api/', include(router.urls)),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('token/', MyTokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account-confirm-email/<str:key>/', ConfirmEmailView.as_view()),
    path('verify-email/', VerifyEmailView.as_view(), name='rest_verify_email'),
    path('account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    re_path(r'^account-confirm-email/(?P<key>[-:\w]+)/$', VerifyEmailView.as_view(), name='account_confirm_email'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
