# SaSPay Wallet - Quick Testing Guide

## Pre-Test Checklist
- [ ] Backend server running: `python manage.py runserver`
- [ ] Frontend dev server running: `npm run dev`
- [ ] Test user account created or ready

## Test Scenario 1: Zero Balance at Start

### Steps
1. Sign up as new user
2. Navigate to Savings Wallet (hamburger → Savings Wallet)
3. **Expected**: Display shows "0.0 XLM" and "0.0 UGX"
4. **Verify**: No default money in wallet

---

## Test Scenario 2: Payment Creates Savings

### Steps
1. From dashboard, click "Pay Now" button (header) or "Pay Merchant" (hamburger)
2. Fill in form:
   - Commodity: `Fuel`
   - Price: `50000` (UGX)
   - Receiver: `+256700000001`
   - Confirm Receiver: `+256700000001`
3. Click "Confirm Payment"
4. **Expected Success Message**: "✓ Payment successful! UGX 5000.00 saved as 1.1100 XLM to your wallet."
5. Modal closes automatically

### Verify Wallet Updated
1. Click "Savings Wallet" from hamburger
2. **Expected**:
   - XLM Balance: `1.1100 XLM`
   - UGX Equivalent: `5,000.00 UGX`
3. **Verify**: Automatic savings calculated correctly (50,000 × 10% = 5,000 UGX)

---

## Test Scenario 3: Multiple Payments Accumulate

### Steps
1. Make second payment:
   - Commodity: `Rice`
   - Price: `100000` UGX
   - Follow same steps
2. System calculates: 100,000 × 10% = 10,000 UGX savings
3. Expected new balance:
   - Total Saved: 5,000 + 10,000 = 15,000 UGX
   - In XLM: 15,000 × 0.000222 = 3.33 XLM

### Verify in Wallet
1. Go to Savings Wallet
2. **Expected**:
   - XLM: `3.3300 XLM`
   - UGX: `15,000.00 UGX`
3. Recent Activity section shows both transactions

---

## Test Scenario 4: Transaction History

### Steps
1. From hamburger, click "Recent Transactions"
2. **Expected to see**:
   - Payment 1: "Payment Saved - 5,000.00 UGX (1.1100 XLM)" - icon shows down arrow
   - Payment 2: "Payment Saved - 10,000.00 UGX (2.2200 XLM)" - icon shows down arrow
3. Both listed with timestamps
4. All show both UGX and XLM amounts

---

## Test Scenario 5: Header Quick Wallet View

### Steps
1. From any dashboard page, look at header
2. Click wallet button (💳 symbol) showing amount
3. **Expected**: Quick popup showing:
   - XLM Balance: `3.33 XLM`
   - UGX Equivalent: `UGX 15,000.00`
   - Exchange Rate note
4. Click again to close

---

## Test Scenario 6: Withdrawal

### Steps
1. In Savings Wallet, click "Withdraw Savings"
2. Enter amount: `5000` UGX
3. Confirm withdrawal
4. **Expected**:
   - Modal closes
   - Balance updates to: 10,000 UGX (2.22 XLM)
   - Recent Activity shows withdrawal transaction

---

## Test Scenario 7: Payment from Header

### Steps
1. Verify "Pay Now" button in header works
2. Make another payment
3. Verify wallet updates automatically

### Verify Header Wallet Display
1. Header should show updated balance
2. Click wallet button - should show latest balance

---

## Expected Values (Based on Test Scenarios)

| Step | Payment | Savings % | Saved UGX | Conversion | Total XLM | Total UGX |
|------|---------|-----------|-----------|-----------|----------|-----------|
| 1 | 50,000 | 10% | 5,000 | ×0.000222 | 1.11 | 5,000 |
| 2 | 100,000 | 10% | 10,000 | ×0.000222 | 3.33 | 15,000 |
| Withdrawal | - | - | -5,000 | ×0.000222 | 2.22 | 10,000 |

---

## Common Issues & Solutions

### Issue: Wallet not updating after payment
**Solution**:
- Check browser console for errors
- Verify backend server is running
- Ensure API endpoints are accessible
- Check user phone number is being sent correctly

### Issue: XLM/UGX amounts not matching
**Solution**:
- Verify conversion rate: 1 UGX = 0.000222 XLM
- Check calculation: Amount × 0.000222 = XLM equivalent
- Example: 5,000 × 0.000222 = 1.11 XLM ✓

### Issue: Transactions not showing
**Solution**:
- Go to wallet page and click refresh
- Check Recent Transactions page
- Verify API endpoint: GET /api/wallet/transactions/?phone={phone}

### Issue: Zero balance not displaying
**Solution**:
- New wallets should show 0.0 XLM and 0.0 UGX
- If showing null, refresh page
- Check browser's local storage isn't caching old values

---

## Verification Checklist

- [ ] New wallet starts at 0.0 XLM and 0.0 UGX
- [ ] Payment calculates 10% savings
- [ ] Savings converted to XLM correctly (amount × 0.000222)
- [ ] Wallet balance updates after payment
- [ ] Header shows wallet balance
- [ ] Quick wallet popup shows correct amounts
- [ ] Transactions page shows all payments
- [ ] Both currencies displayed in transactions
- [ ] "Pay Now" and "Pay Merchant" both work
- [ ] Auto-refresh works after payment
- [ ] Withdrawal works and updates balance
- [ ] Multiple payments accumulate correctly

---

## Debug Mode

To see API calls in action:
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Make a payment
4. Watch these requests:
   - POST /api/wallet/deposit/ (saves amount)
   - GET /api/wallet/get/ (fetches updated balance)
   - GET /api/wallet/transactions/ (gets history)

Expected responses should include wallet data with both xlm_balance and ugx_balance fields.

---

**Ready to test!** Follow scenarios 1-7 in order for complete verification.
