from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser, FormParser
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import SignupSerializer, ProfileUpdateSerializer, PasswordChangeSerializer


# SIGNUP
@api_view(['POST'])
@csrf_exempt
@parser_classes([JSONParser, FormParser])
def signup(request):
    print("Signup request data:", request.data)
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"})

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