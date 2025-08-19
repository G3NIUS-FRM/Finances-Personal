from django.urls import path 
from .views import Register,Transactions,GenerateReportView,UserProfile,UserSettingsView, SearchTransactions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns=[
    path('register/', Register.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('transactions/', Transactions.as_view(), name='Transactions'),
    path('reports/', GenerateReportView.as_view(), name='GenerateReport'),
    path('profile/', UserProfile.as_view(), name='Profile'),
    path('settings/', UserSettingsView.as_view(), name='Settings'),
    path('transactions/search/',SearchTransactions.as_view(), name='SearchTransactions')
]