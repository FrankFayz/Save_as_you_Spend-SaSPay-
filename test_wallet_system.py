#!/usr/bin/env python
"""
Test script to verify the wallet conversion system
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, 'c:\\Users\\hp\\Desktop\\SASPAY\\saspay_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saspay_backend.settings')
django.setup()

from accounts.models import User, StellarWallet, WalletTransaction
from accounts.stellar_utils import StellarWalletManager
from decimal import Decimal

print("=" * 60)
print("SASPAY WALLET SYSTEM - VERIFICATION TEST")
print("=" * 60)

# Test 1: Conversion functions
print("\n[TEST 1] Conversion Functions")
print("-" * 60)
test_amounts = [5000, 10000, 25000, 50000, 100000]
for ugx in test_amounts:
    xlm = StellarWalletManager.convert_ugx_to_xlm(Decimal(str(ugx)))
    print(f"  UGX {ugx:,} = {xlm} XLM")

# Test 2: Check wallet setup
print("\n[TEST 2] Wallet Setup")
print("-" * 60)
users = User.objects.all()[:5]
if users:
    for user in users:
        if hasattr(user, 'wallet'):
            wallet = user.wallet
            print(f"  User: {user.phone}")
            print(f"    - XLM Balance: {wallet.xlm_balance}")
            print(f"    - UGX Balance: {wallet.ugx_balance}")
            print(f"    - Transactions: {wallet.transactions.count()}")
        else:
            print(f"  User {user.phone}: No wallet yet (will be created on first payment)")
else:
    print("  No users found in database")

# Test 3: Exchange rate
print("\n[TEST 3] Exchange Rate Configuration")
print("-" * 60)
from accounts.stellar_utils import UGX_TO_XLM_RATE
xlm_per_ugx = UGX_TO_XLM_RATE
ugx_per_xlm = 1 / xlm_per_ugx
print(f"  1 UGX = {xlm_per_ugx} XLM")
print(f"  1 XLM = {ugx_per_xlm:,.0f} UGX")

print("\n" + "=" * 60)
print("✓ WALLET SYSTEM VERIFICATION COMPLETE")
print("=" * 60)
