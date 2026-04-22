"""
Stellar Testnet Integration for SaSPay Wallet
Handles XLM transactions, balance management, and UGX conversions
"""

from stellar_sdk import Server, Keypair, TransactionBuilder, Network
import requests
import os
from decimal import Decimal

# Stellar Testnet Configuration
STELLAR_NETWORK = Network.testnet_network()
STELLAR_SERVER = Server("https://horizon-testnet.stellar.org")
STELLAR_FUNDING_AMOUNT = 50  # XLM to fund new accounts

# Fixed exchange rate (in production, fetch from API)
# 1 XLM = 4500 UGX (example rate)
UGX_TO_XLM_RATE = Decimal("0.000222")  # 1 UGX = 0.000222 XLM (1 XLM = 4500 UGX)


class StellarWalletManager:
    """Manages Stellar wallet operations for SaSPay users"""
    
    @staticmethod
    def create_keypair():
        """Generate a new Stellar keypair"""
        return Keypair.random()
    
    @staticmethod
    def create_wallet(user):
        """
        Create a new Stellar wallet for a user
        Uses testnet friendbot for free test XLM
        """
        try:
            keypair = StellarWalletManager.create_keypair()
            public_key = keypair.public_key
            secret_key = keypair.secret
            
            # Fund the account using testnet friendbot
            response = STELLAR_SERVER.submit_transaction(
                _fund_account_friendbot(public_key)
            )
            
            if response:
                return {
                    'success': True,
                    'public_key': public_key,
                    'secret_key': secret_key,
                    'message': 'Wallet created and funded'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def get_balance(public_key):
        """Get account balance in XLM and USD"""
        try:
            account = STELLAR_SERVER.accounts().account_id(public_key).call()
            
            balances = {}
            for balance in account['balances']:
                asset_type = balance['asset_type']
                if asset_type == 'native':
                    balances['xlm'] = Decimal(balance['balance'])
                elif balance['asset_code'] == 'USD':
                    balances['usd'] = Decimal(balance['balance'])
            
            return {
                'success': True,
                'balances': balances,
                'xlm_balance': balances.get('xlm', Decimal('0'))
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def send_payment(sender_secret, receiver_public, amount_xlm, memo=''):
        """
        Send XLM to another account
        amount_xlm: Decimal amount of XLM to send
        """
        try:
            sender = Keypair.from_secret(sender_secret)
            
            # Get sender's account
            source_account = STELLAR_SERVER.load_account(sender.public_key)
            
            # Build transaction
            transaction = TransactionBuilder(
                source_account=source_account,
                base_fee=100,
                network=STELLAR_NETWORK
            ).add_text_memo(memo).append_payment_op(
                destination=receiver_public,
                amount=str(amount_xlm),
                asset_code='native'
            ).set_timeout(30).build()
            
            # Sign transaction
            transaction.sign(sender)
            
            # Submit transaction
            response = STELLAR_SERVER.submit_transaction(transaction)
            
            return {
                'success': True,
                'transaction_hash': response['hash'],
                'message': f'Sent {amount_xlm} XLM'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def convert_ugx_to_xlm(ugx_amount):
        """Convert UGX to XLM"""
        return Decimal(ugx_amount) * UGX_TO_XLM_RATE
    
    @staticmethod
    def convert_xlm_to_ugx(xlm_amount):
        """Convert XLM to UGX"""
        return Decimal(xlm_amount) / UGX_TO_XLM_RATE
    
    @staticmethod
    def fund_account_friendbot(public_key):
        """Fund a testnet account using friendbot"""
        try:
            print(f"[Friendbot] Requesting funding for {public_key}...")
            response = requests.get(
                f"https://friendbot.stellar.org?addr={public_key}",
                timeout=30  # Increased timeout
            )
            
            print(f"[Friendbot] Response status: {response.status_code}")
            print(f"[Friendbot] Response body: {response.text}")
            
            if response.status_code == 200:
                print(f"[Friendbot] Successfully funded account")
                return {
                    'success': True,
                    'message': f'Account {public_key} funded with test XLM'
                }
            else:
                error_msg = f'Friendbot error: HTTP {response.status_code}'
                print(f"[Friendbot] {error_msg}")
                return {
                    'success': False,
                    'error': error_msg
                }
        except requests.exceptions.Timeout:
            error_msg = "Friendbot request timeout - service may be slow"
            print(f"[Friendbot] {error_msg}")
            return {
                'success': False,
                'error': error_msg
            }
        except requests.exceptions.ConnectionError:
            error_msg = "Friendbot connection error - service may be down"
            print(f"[Friendbot] {error_msg}")
            return {
                'success': False,
                'error': error_msg
            }
        except Exception as e:
            error_msg = f"Friendbot error: {str(e)}"
            print(f"[Friendbot] {error_msg}")
            return {
                'success': False,
                'error': error_msg
            }


def _fund_account_friendbot(public_key):
    """Helper function to fund account via friendbot"""
    try:
        response = requests.get(
            f"https://friendbot.stellar.org?addr={public_key}",
            timeout=10
        )
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Friendbot error: {response.status_code}")
    except Exception as e:
        raise Exception(f"Failed to fund account: {str(e)}")
