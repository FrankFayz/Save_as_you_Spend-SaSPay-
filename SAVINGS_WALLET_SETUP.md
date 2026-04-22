# SaSPay Savings Wallet - Complete Setup & Testing Guide

## ✅ Implementation Status

Your Savings Wallet feature is now **fully implemented**! Here's what's been completed:

### Backend ✓
- ✅ Stellar testnet integration with automatic account funding
- ✅ XLM ↔ UGX conversion system (1 XLM = 4500 UGX)
- ✅ Django models for wallets and transactions
- ✅ API endpoints for wallet creation, deposits, and withdrawals
- ✅ Transaction history tracking

### Frontend ✓
- ✅ Complete Savings Wallet React component with real-time balance display
- ✅ Withdraw modal with conversion preview
- ✅ Transaction history with timestamps
- ✅ Loading states and error handling
- ✅ Responsive styling (mobile-friendly)
- ✅ Integration with hamburger menu and header

### Integration ✓
- ✅ Automatic savings deposit after each payment
- ✅ Payment flow → Merchant receives full amount → Savings stored in wallet
- ✅ Configurable savings percentage (default 10%)

---

## 🚀 Getting Started

### Prerequisites
1. Python 3.8+ with Django 6.0+
2. Node.js 16+ for frontend
3. `requests` library (install: `pip install requests`)
4. `stellar-sdk` library (install: `pip install stellar-sdk`)

### 1. Install Python Dependencies

```bash
cd C:\Users\hp\Desktop\SASPAY
python -m venv .venv                          # If not already created
.\.venv\Scripts\Activate.ps1                  # Activate virtual environment
pip install django==6.0.2 djangorestframework python-decouple pillow stellar-sdk requests
```

### 2. Run Database Migrations

```bash
cd saspay_backend
python manage.py migrate
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### 3. Run Frontend Development Server

In a new terminal:
```bash
cd C:\Users\hp\Desktop\SASPAY\SaSPay2
npm install                                    # If not already done
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🧪 Testing the Savings Wallet

### Test Scenario 1: Create User Account

1. Open `http://localhost:5173` in browser
2. Go to **Signup** page
3. Enter:
   - **Username**: Test User
   - **Phone**: +256701234567
   - **Password**: testpass123
4. Click **Sign Up**

### Test Scenario 2: Make First Payment

1. After login, click **"Pay Merchant"** button (header or hamburger menu)
2. Fill in payment details:
   - **Commodity**: Sugar
   - **Price**: 50,000 (UGX)
   - **Confirmation Number**: 1234 (twice)
3. Click **Submit**

**What happens behind the scenes:**
- Merchant receives: 50,000 UGX (full payment)
- 10% savings calculated: 5,000 UGX
- 5,000 UGX converted to XLM: ~1.11 XLM
- XLM stored in user's Stellar testnet wallet
- Transaction recorded in wallet history

### Test Scenario 3: View Savings Wallet

1. Click **"Savings Wallet"** in hamburger menu
2. You should see:
   - **Uganda Shillings**: 5,000 UGX (your savings)
   - **Stellar Lumens**: ~1.11 XLM (blockchain balance)
   - **Recent Activity**: Payment deposit transaction

### Test Scenario 4: Make Multiple Payments

1. Click "Pay Merchant" again
2. Enter different amount (e.g., 100,000 UGX)
3. Submit
4. Go back to Savings Wallet
5. Balance should increase:
   - UGX: 15,000
   - XLM: ~3.33

### Test Scenario 5: Withdraw Savings

1. In Savings Wallet, click **"Withdraw Savings"** button
2. Enter withdrawal amount: **10,000 UGX**
3. Modal shows: "You will withdraw: ~2.22 XLM"
4. Click **"Confirm Withdrawal"**
5. Balance updates:
   - UGX: 5,000 (15,000 - 10,000)
   - XLM: ~1.11 (decreased accordingly)
6. New transaction appears in history

### Test Scenario 6: View Transaction History

In Savings Wallet, scroll down to **"Recent Activity"**:
- Shows all deposits and withdrawals
- Displays amounts in both UGX and XLM
- Shows transaction dates
- Icons indicate transaction type (↓ withdraw, ↑ deposit)

---

## 🔧 Configuration

### Change Savings Percentage

The savings percentage is stored in **localStorage**:

**In browser console:**
```javascript
localStorage.setItem("savingsPercentage", 20);  // Change to 20%
```

Or modify in code: `SaSPay2/src/components/Dashboard/PaymentModal.jsx`
```javascript
const [savingPercent, setSavingPercent] = useState(10);  // Change default here
```

### Change Exchange Rate

Edit `saspay_backend/accounts/stellar_utils.py`:

```python
# Current rate: 1 XLM = 4500 UGX
UGX_TO_XLM_RATE = Decimal("0.000222")  # Modify this value

# Example: If you want 1 XLM = 5000 UGX:
# UGX_TO_XLM_RATE = Decimal("0.0002")  # 1 UGX = 0.0002 XLM
```

After changing the rate:
```bash
# Restart Django server
python manage.py runserver
```

---

## 🌐 API Endpoints Reference

### Create Wallet
```
POST http://localhost:8000/api/accounts/wallet/create/
Content-Type: application/json

{
    "phone": "+256701234567"
}
```

### Get Wallet
```
GET http://localhost:8000/api/accounts/wallet/get/?phone=%2B256701234567
```

### Deposit Savings
```
POST http://localhost:8000/api/accounts/wallet/deposit/
Content-Type: application/json

{
    "phone": "+256701234567",
    "amount_ugx": "5000",
    "transaction_id": "12345"
}
```

### Withdraw Savings
```
POST http://localhost:8000/api/accounts/wallet/withdraw/
Content-Type: application/json

{
    "phone": "+256701234567",
    "amount_ugx": "5000"
}
```

### Get Transaction History
```
GET http://localhost:8000/api/accounts/wallet/transactions/?phone=%2B256701234567
```

---

## 🐛 Troubleshooting

### Issue: "Wallet not found" error
**Solution:**
- Make sure wallet was created successfully when user signed up
- Try making a payment - this will auto-create wallet if missing
- Click "Create Wallet" button in error state

### Issue: "Friendbot error" when creating wallet
**Solution:**
- Stellar testnet friendbot might be temporarily down
- Wait 5-10 minutes and try again
- Check: https://friendbot.stellar.org

### Issue: Balance not updating after payment
**Solution:**
1. Click "Refresh" button in wallet header
2. Check browser console for API errors (F12 → Console)
3. Verify phone number matches user account
4. Check backend logs: `python manage.py runserver` output

### Issue: Withdrawal fails with "Insufficient balance"
**Solution:**
- Ensure withdrawal amount is less than current balance
- XLM to UGX conversion might show rounding differences
- Try withdrawing slightly less than shown balance

### Issue: CORS errors
**Solution:**
- Already configured in `settings.py`
- If still getting errors, add your frontend URL to `CORS_ALLOWED_ORIGINS`:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
  ]
  ```

---

## 💡 How It Works Under the Hood

### Payment Flow
```
User clicks "Pay Merchant"
         ↓
User enters commodity and price
         ↓
System calculates savings (10% of price)
         ↓
✓ Merchant receives FULL price (non-blockchain)
✓ Savings amount is converted UGX → XLM
         ↓
System creates wallet transaction record
         ↓
XLM stored in Stellar testnet wallet
         ↓
User balance updated in database
         ↓
Transaction appears in history
```

### Why This Design?
1. **Simple for users**: No blockchain complexity visible
2. **Automatic savings**: Saves on every purchase
3. **Transparent**: User sees both UGX and XLM balances
4. **Safe**: Uses Stellar testnet (no real money)
5. **Flexible**: Can withdraw anytime

---

## 📊 Data Flow Diagram

```
Frontend (React)
    ↓
    ├─ Payment Modal
    │   └─ User enters payment
    │       ↓
    │   POST /api/accounts/wallet/deposit/
    │
    ├─ Savings Wallet Component
    │   ├─ Displays balance (UGX + XLM)
    │   ├─ Shows transaction history
    │   └─ Withdrawal modal
    │       ↓
    │       POST /api/accounts/wallet/withdraw/
    │
Backend (Django)
    ↓
    ├─ API Views (views.py)
    │   ├─ Create wallet
    │   ├─ Deposit savings
    │   └─ Withdraw savings
    │
    ├─ Stellar Utilities (stellar_utils.py)
    │   ├─ Create keypair
    │   ├─ Convert UGX ↔ XLM
    │   └─ Fund account (friendbot)
    │
    └─ Database (SQLite)
        ├─ StellarWallet model
        ├─ WalletTransaction model
        └─ User model
```

---

## 🔐 Security Notes

### Current Implementation (Development)
- Secret keys stored in plain text in database
- Uses testnet (no real money)
- CORS enabled for localhost

### For Production
1. **Encrypt secret keys** in database
2. **Use mainnet** with real Stellar
3. **Restrict CORS** to your domain only
4. **Add authentication** to wallet endpoints
5. **Implement rate limiting**
6. **Use environment variables** for Stellar network config
7. **Add transaction signing** for withdrawals
8. **Implement webhook** for transaction confirmations

---

## 📝 File Checklist

Backend files modified/created:
- ✅ `saspay_backend/accounts/stellar_utils.py` - Stellar integration
- ✅ `saspay_backend/accounts/models.py` - StellarWallet & WalletTransaction models
- ✅ `saspay_backend/accounts/serializers.py` - Serializers for wallet data
- ✅ `saspay_backend/accounts/views.py` - API endpoints
- ✅ `saspay_backend/accounts/urls.py` - URL routing
- ✅ `saspay_backend/saspay_backend/settings.py` - CORS & app config

Frontend files:
- ✅ `SaSPay2/src/components/Dashboard/SavingsWallet.jsx` - Main wallet component
- ✅ `SaSPay2/src/components/Dashboard/SavingsWallet.css` - Wallet styling
- ✅ `SaSPay2/src/components/Dashboard/Sidebar.jsx` - Hamburger menu navigation
- ✅ `SaSPay2/src/components/Dashboard/MainDashboard.jsx` - Route handling
- ✅ `SaSPay2/src/components/Dashboard/PaymentModal.jsx` - Auto-savings integration

---

## 🎯 Next Steps

1. **Start the servers** (instructions above)
2. **Create a test account**
3. **Make test payments**
4. **View wallet balance**
5. **Test withdrawal**
6. **Check transaction history**

---

## 📞 Support

If you encounter any issues:
1. Check the **Troubleshooting** section above
2. Look at browser console (F12 → Console) for frontend errors
3. Check backend logs in terminal for server errors
4. Verify all API endpoints are responding (use Postman or curl)

---

## ✨ Features Implemented

- ✅ Automatic wallet creation on first payment
- ✅ XLM ↔ UGX conversion
- ✅ Deposit tracking
- ✅ Withdrawal with balance checks
- ✅ Transaction history with timestamps
- ✅ Real-time balance display
- ✅ User-friendly withdrawal modal
- ✅ Stellar testnet integration
- ✅ Responsive mobile design
- ✅ Error handling and validation

---

**Happy Testing! 🎉**

Your SaSPay Savings Wallet is ready to use. Enjoy saving automatically on every purchase!
