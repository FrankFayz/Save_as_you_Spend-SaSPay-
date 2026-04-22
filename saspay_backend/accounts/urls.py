from django.urls import path
from .views import (
    signup, login, update_profile, change_password,
    create_wallet, get_wallet, deposit_savings, withdraw_savings,
    get_wallet_transactions
)

urlpatterns = [
    path("signup/", signup),
    path("login/", login),
    path("update-profile/", update_profile),
    path("change-password/", change_password),
    # Wallet endpoints
    path("wallet/create/", create_wallet),
    path("wallet/get/", get_wallet),
    path("wallet/deposit/", deposit_savings),
    path("wallet/withdraw/", withdraw_savings),
    path("wallet/transactions/", get_wallet_transactions),
]