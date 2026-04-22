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


# STELLAR WALLET MODEL
class StellarWallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    public_key = models.CharField(max_length=255, unique=True)  # Stellar public key
    secret_key = models.TextField()  # Encrypted Stellar secret key
    xlm_balance = models.DecimalField(max_digits=20, decimal_places=8, default=0)  # Balance in XLM
    ugx_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)  # Balance in UGX (for display)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Wallet for {self.user.username}"


# WALLET TRANSACTION MODEL (for tracking history)
class WalletTransaction(models.Model):
    TRANSACTION_TYPE = (
        ('deposit', 'Deposit'),
        ('withdraw', 'Withdrawal'),
        ('savings', 'Auto Savings'),
    )
    
    wallet = models.ForeignKey(StellarWallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE)
    amount_ugx = models.DecimalField(max_digits=15, decimal_places=2)  # Amount in UGX
    amount_xlm = models.DecimalField(max_digits=20, decimal_places=8)  # Amount in XLM
    stellar_tx_hash = models.CharField(max_length=255, blank=True, null=True)  # Stellar transaction hash
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount_ugx} UGX"