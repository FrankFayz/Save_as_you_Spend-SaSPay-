from django.urls import path
from .views import signup, login, update_profile, change_password

urlpatterns = [
    path("signup/", signup),
    path("login/", login),
    path("update-profile/", update_profile),
    path("change-password/", change_password),
]