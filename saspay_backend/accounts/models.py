from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


# USER MANAGER
class UserManager(BaseUserManager):
    def create_user(self, phone, username, password=None):
        if not phone:
            raise ValueError("Phone is required")

        user = self.model(
            phone=phone,
            username=username
        )

        user.set_password(password)  # 🔥 HASH PASSWORD
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, username, password):
        user = self.create_user(phone, username, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


# USER MODEL
class User(AbstractBaseUser):
    username = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True)  # PRIMARY LOGIN KEY
    profile_picture = models.TextField(blank=True, null=True)  # Base64 profile image or image URL

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.phone

    @property
    def is_staff(self):
        return self.is_admin