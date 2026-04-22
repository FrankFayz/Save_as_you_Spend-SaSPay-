from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser, FormParser
from rest_framework.authtoken.models import Token
from .models import User, StellarWallet, WalletTransaction
from .serializers import SignupSerializer, ProfileUpdateSerializer, PasswordChangeSerializer, StellarWalletSerializer, WalletTransactionSerializer
from .stellar_utils import StellarWalletManager
from decimal import Decimal


# HELPER FUNCTION: Create wallet for user
def _create_wallet_for_user(user):
    """
    Create a Stellar wallet for a user starting at 0 UGX and 0 XLM.
    Returns a dict with 'success', 'wallet', and optional 'error' keys.
    """
    try:
        # Check if wallet already exists
        if hasattr(user, 'wallet'):
            return {
                'success': True,
                'wallet': user.wallet,
                'already_exists': True
            }
        
        # Generate keypair
        keypair = StellarWalletManager.create_keypair()
        public_key = keypair.public_key
        secret_key = keypair.secret
        
        print(f"Generated keypair for user {user.phone}: {public_key}")
        
        # Create wallet in database with 0 balance (user will fund through payments)
        wallet = StellarWallet.objects.create(
            user=user,
            public_key=public_key,
            secret_key=secret_key,
            xlm_balance=Decimal('0'),  # Start at 0
            ugx_balance=Decimal('0')   # Start at 0
        )
        
        print(f"Wallet created for user {user.phone} with 0 balance")
        
        return {
            'success': True,
            'wallet': wallet,
            'funded': False
        }
    
    except Exception as e:
        print(f"Error creating wallet for user {user.phone}: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'success': False,
            'error': str(e)
        }


# SIGNUP
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def signup(request):
    print("Signup request data:", request.data)
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        print(f"User created: {user.phone}")
        
        # Automatically create wallet for the user with 0 balance
        wallet_result = _create_wallet_for_user(user)
        
        if wallet_result['success']:
            wallet_serializer = StellarWalletSerializer(wallet_result['wallet'])
            print(f"Wallet created automatically for user {user.phone}")
            return Response({
                "message": "User created successfully and wallet initialized",
                "user": {
                    "phone": user.phone,
                    "username": user.username
                },
                "wallet": wallet_serializer.data
            }, status=201)
        else:
            # User was created but wallet creation failed
            print(f"Wallet creation failed for user {user.phone}: {wallet_result.get('error')}")
            return Response({
                "message": "User created but wallet initialization failed",
                "user": {
                    "phone": user.phone,
                    "username": user.username
                },
                "wallet_error": wallet_result.get('error')
            }, status=201)

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


# LOGIN
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def login(request):
    print("Login request data:", request.data)
    phone = request.data.get('phone')
    password = request.data.get('password')
    print(f"Phone: {phone}, Password: {password}")

    # Use Django's authenticate function
    user = authenticate(request, username=phone, password=password)
    
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        print("Login successful for user:", user.username)
        return Response({
            "message": "Login successful",
            "token": token.key,
            "user": {
                "username": user.username,
                "phone": user.phone,
                "profile_picture": user.profile_picture
            }
        })
    else:
        print("Authentication failed")
        return Response({"message": "Invalid credentials"}, status=400)


# PROFILE UPDATE
@api_view(['PUT'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def update_profile(request):
    print("Profile update request data:", request.data)
    
    # Get user from phone (since that's our primary key)
    phone = request.data.get('phone')
    if not phone:
        return Response({"message": "Phone number is required"}, status=400)
    
    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    
    serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Profile updated successfully",
            "user": {
                "username": serializer.instance.username,
                "phone": serializer.instance.phone,
                "profile_picture": serializer.instance.profile_picture
            }
        })
    
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


# PASSWORD CHANGE
@api_view(['PUT'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def change_password(request):
    print("Password change request data:", request.data)
    
    phone = request.data.get('phone')
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not all([phone, old_password, new_password]):
        return Response({"message": "All fields are required"}, status=400)
    
    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    
    # Verify old password
    if not user.check_password(old_password):
        return Response({"message": "Old password is incorrect"}, status=400)
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    return Response({"message": "Password changed successfully"})

# WALLET OPERATIONS

# CREATE WALLET
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def create_wallet(request):
    """Create a new Stellar wallet for a user"""
    print("Create wallet request data:", request.data)
    
    phone = request.data.get('phone')
    if not phone:
        return Response({"message": "Phone number is required"}, status=400)
    
    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    
    # Use helper function to create wallet
    wallet_result = _create_wallet_for_user(user)
    
    if wallet_result['success']:
        serializer = StellarWalletSerializer(wallet_result['wallet'])
        return Response({
            "message": "Wallet created successfully" if not wallet_result.get('already_exists') else "Wallet already exists",
            "wallet": serializer.data
        }, status=201)
    else:
        return Response({
            "message": "Error creating wallet",
            "error": wallet_result.get('error')
        }, status=400)


# GET WALLET
@api_view(['GET'])
@csrf_exempt
def get_wallet(request):
    """Get wallet details for a user"""
    phone = request.query_params.get('phone')
    if not phone:
        return Response({"message": "Phone number is required"}, status=400)
    
    try:
        user = User.objects.get(phone=phone)
        wallet = user.wallet
        
        # Update balance from Stellar
        balance_response = StellarWalletManager.get_balance(wallet.public_key)
        if balance_response['success']:
            wallet.xlm_balance = balance_response['balances'].get('xlm', wallet.xlm_balance)
            wallet.save()
        
        serializer = StellarWalletSerializer(wallet)
        return Response({
            "message": "Wallet retrieved successfully",
            "wallet": serializer.data
        })
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except StellarWallet.DoesNotExist:
        return Response({"message": "Wallet not found. Create one first."}, status=404)
    except Exception as e:
        return Response({"message": "Error retrieving wallet", "error": str(e)}, status=400)


# DEPOSIT TO WALLET (from payment savings)
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def deposit_savings(request):
    """Deposit savings to wallet (called after payment)"""
    print("Deposit savings request:", request.data)
    
    try:
        phone = request.data.get('phone')
        amount_ugx_raw = request.data.get('amount_ugx', 0)
        transaction_id = request.data.get('transaction_id')
        
        # Convert to Decimal safely
        try:
            amount_ugx = Decimal(str(amount_ugx_raw))
        except:
            return Response({"message": "Invalid amount format"}, status=400)
        
        if not all([phone, amount_ugx]):
            return Response({"message": "Phone and amount are required"}, status=400)
        
        if amount_ugx <= 0:
            return Response({"message": "Amount must be greater than 0"}, status=400)
        
        user = User.objects.get(phone=phone)
        wallet = user.wallet
        
        # Convert UGX to XLM
        amount_xlm = StellarWalletManager.convert_ugx_to_xlm(amount_ugx)
        
        # Update wallet balances
        wallet.xlm_balance += amount_xlm
        wallet.ugx_balance += amount_ugx
        wallet.save()
        
        # Record transaction
        wallet_tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type='savings',
            amount_ugx=amount_ugx,
            amount_xlm=amount_xlm,
            description=f'Auto savings from payment (TX: {transaction_id})'
        )
        
        serializer = StellarWalletSerializer(wallet)
        return Response({
            "message": "Savings deposited successfully",
            "wallet": serializer.data
        })
    
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except StellarWallet.DoesNotExist:
        return Response({"message": "Wallet not found"}, status=404)
    except Exception as e:
        print(f"Error depositing savings: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"message": "Error depositing savings", "error": str(e)}, status=400)


# WITHDRAW FROM WALLET
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def withdraw_savings(request):
    """Withdraw savings from wallet (convert XLM to UGX)"""
    print("Withdraw savings request:", request.data)
    
    try:
        phone = request.data.get('phone')
        amount_ugx_raw = request.data.get('amount_ugx', 0)
        
        # Convert to Decimal safely
        try:
            amount_ugx = Decimal(str(amount_ugx_raw))
        except:
            return Response({"message": "Invalid amount format"}, status=400)
        
        if not all([phone, amount_ugx]):
            return Response({"message": "Phone and amount are required"}, status=400)
        
        if amount_ugx <= 0:
            return Response({"message": "Amount must be greater than 0"}, status=400)
        
        user = User.objects.get(phone=phone)
        wallet = user.wallet
        
        # Convert UGX to XLM to check balance
        amount_xlm = StellarWalletManager.convert_ugx_to_xlm(amount_ugx)
        
        # Check if wallet has enough balance
        if wallet.xlm_balance < amount_xlm:
            return Response({
                "message": "Insufficient balance",
                "balance_xlm": str(wallet.xlm_balance),
                "balance_ugx": str(wallet.ugx_balance),
                "required_xlm": str(amount_xlm)
            }, status=400)
        
        # Update wallet balances
        wallet.xlm_balance -= amount_xlm
        wallet.ugx_balance -= amount_ugx
        wallet.save()
        
        # Record transaction
        wallet_tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type='withdraw',
            amount_ugx=amount_ugx,
            amount_xlm=amount_xlm,
            description=f'Withdrawal of {amount_ugx} UGX'
        )
        
        serializer = StellarWalletSerializer(wallet)
        return Response({
            "message": "Withdrawal successful",
            "amount_ugx": str(amount_ugx),
            "amount_xlm": str(amount_xlm),
            "wallet": serializer.data
        })
    
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except StellarWallet.DoesNotExist:
        return Response({"message": "Wallet not found"}, status=404)
    except Exception as e:
        print(f"Error withdrawing savings: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"message": "Error withdrawing savings", "error": str(e)}, status=400)


# GET WALLET TRANSACTIONS
@api_view(['GET'])
@csrf_exempt
def get_wallet_transactions(request):
    """Get wallet transaction history"""
    phone = request.query_params.get('phone')
    if not phone:
        return Response({"message": "Phone number is required"}, status=400)
    
    try:
        user = User.objects.get(phone=phone)
        wallet = user.wallet
        transactions = wallet.transactions.all().order_by('-created_at')
        
        serializer = WalletTransactionSerializer(transactions, many=True)
        return Response({
            "message": "Transactions retrieved successfully",
            "transactions": serializer.data
        })
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except StellarWallet.DoesNotExist:
        return Response({"message": "Wallet not found"}, status=404)
    except Exception as e:
        print(f"Error retrieving transactions: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"message": "Error retrieving transactions", "error": str(e)}, status=400)
    except Exception as e:
        return Response({"message": "Error retrieving transactions", "error": str(e)}, status=400)