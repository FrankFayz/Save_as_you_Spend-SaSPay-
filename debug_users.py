import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saspay_backend.settings')
django.setup()

from accounts.models import User
users = User.objects.all()
for user in users:
    print(f'User: {user.username}, Phone: {user.phone}, Has password: {bool(user.password)}')
    if user.phone == '+256700000000':
        print(f'Password hash: {user.password}')
        print(f'Check password testpass123: {user.check_password("testpass123")}')
        print(f'Check password wrongpass: {user.check_password("wrongpass")}')