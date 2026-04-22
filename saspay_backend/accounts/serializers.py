from rest_framework import serializers
from .models import User, StellarWallet, WalletTransaction


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            phone=validated_data['phone'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_picture']

    def update(self, instance, validated_data):
        # Update username
        if 'username' in validated_data:
            instance.username = validated_data['username']
        
        # Update profile picture
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
            
        instance.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'amount_ugx', 'amount_xlm', 'stellar_tx_hash', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class StellarWalletSerializer(serializers.ModelSerializer):
    transactions = WalletTransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = StellarWallet
        fields = ['id', 'public_key', 'xlm_balance', 'ugx_balance', 'created_at', 'updated_at', 'transactions']
        read_only_fields = ['id', 'public_key', 'xlm_balance', 'ugx_balance', 'created_at', 'updated_at']