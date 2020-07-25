from rest_framework import serializers
from .models import RegisterModel
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisterModel
        fields = '__all__'