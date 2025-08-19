from rest_framework import serializers
from .models import Transaction, Category, User, UserSettings

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model= Transaction
        fields= '__all__'
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model= Category
        fields='__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields='__all__'
class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['currency', 'monthly_budget']