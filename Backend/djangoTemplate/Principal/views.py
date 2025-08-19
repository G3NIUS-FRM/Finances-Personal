from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User, Category, Transaction, Report, UserSettings
from .serializers import TransactionSerializer, UserSerializer, UserSettingsSerializer, CategorySerializer
from datetime import date
from django.db.models import Sum

class Register(APIView):
    def post(self, request):
        data = request.data
        
        first_name = data['first_name']
        last_name = data['last_name']
        
        email = data['email']
        
        username = data['username']
        password1 = data['password1']
        password2 = data['password2']
        
        email_check = User.objects.filter(email=email).exists()
        if email_check:
            return Response({'error': 'El email ya está en uso'}, status=status.HTTP_401_UNAUTHORIZED)
        
        username_check = User.objects.filter(username=username).exists()
        if username_check:
            return Response({'error': 'El nombre de usuario ya está en uso'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if password1 != password2:
            return Response({'error': 'Las Password no coinciden'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.create(first_name=first_name, last_name=last_name, username=username, email=email)
        user.set_password(password1)
        user.save()
        UserSettings.objects.create(user=user, currency="USD", monthly_budget=0).save()
    
        return Response({'message': 'Te has registrado correctamente'})
        

def monthly_budget_update(user):
    settings = UserSettings.objects.get(user=user)
    if settings.monthly_budget > 0:
        category = Category.objects.filter(name='Monthly Update').first()
        if category:
            Transaction.objects.create(
                user=user,
                date=date.today(),
                amount=settings.monthly_budget,
                description="Presupuesto Mensual",
                category=category
            )
        
        
        

class Transactions(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        year= request.query_params.get('year')
        month=request.query_params.get('month')
        if not year or not month:
            hoy=date.today()
            year=hoy.year
            month=hoy.month
        user_transactions=Transaction.objects.filter(user=request.user, date__month=month, date__year=year)
        transaction_serializer=TransactionSerializer(user_transactions, many=True)
        admin_user= User.objects.get(username='admin')
        categories=Category.objects.filter(user=admin_user)
        categories_serializer=CategorySerializer(categories, many=True)
        today=date.today()
        if today.day == 1:
            presupuestos_existentes = Transaction.objects.filter(
                date=today, 
                description="Presupuesto Mensual"
            ).values_list("user_id", flat=True)
            users= User.objects.all()
            for user in users:
                if user.id in presupuestos_existentes:
                    continue
                monthly_budget_update(user)
        return Response({'transactions': transaction_serializer.data, 'categories': categories_serializer.data})
    
    def post(self, request):
        data = request.data.copy()
        data['user']=request.user.id
        transaction_serializer=TransactionSerializer(data=data)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return Response(transaction_serializer.data)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        data=request.data.copy()
        try:
            transaction=Transaction.objects.get(id=data['id'])
        except Transaction.DoesNotExist:
            return Response({'error': 'Producto no encontrado'})
        del data['id']
        data['user']=request.user.id
        transaction_serializer=TransactionSerializer(transaction, data=data)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return Response(transaction_serializer.data)
        return Response(transaction_serializer.errors)
    def delete(self, request):
        data=request.data
        
        try:
            transaction=Transaction.objects.get(id=data['id'])
        except Transaction.DoesNotExist:
            return Response({'error':'La transaccion no tiene id'})
        transaction.delete()
        return Response({'message':'Transaccion Borrada con exito'})
    
    
class GenerateReportView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        user = request.user
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        # Validar que las fechas estén presentes
        if not start_date or not end_date:
            return Response({"error": "Debes enviar start_date y end_date"}, status=400)

        # Filtrar transacciones en el rango
        transactions = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        )
        
        
        # Calcular ingresos y gastos
        income_categories=Category.objects.filter(type='income')
        total_income = transactions.filter(category__in=income_categories).aggregate(
            total=Sum('amount')
        )['total'] or 0
        expense_categories=Category.objects.filter(type='expense')
        total_expense = transactions.filter(category__in=expense_categories).aggregate(
            total=Sum('amount')
        )['total'] or 0
        transactions_serializer=TransactionSerializer(transactions, many=True).data

        # Crear el reporte
        report = Report.objects.create(
            user=user,
            start_date=start_date,
            end_date=end_date,
            total_income=total_income,
            total_expense=total_expense
        )

        return Response({
            "message": "Reporte generado con éxito",
            "report_id": report.id,
            "balance": report.balance(),
            "transactions":transactions_serializer
        })        
       
        
        
class UserProfile(APIView):
    permission_classes= [IsAuthenticated]
    def get(self, request):
        user=request.user
        user_info=UserSerializer(user)
        return Response(user_info.data)
    def put(self,request):
        data=request.data

        user_serializer=UserSerializer(request.user, data=data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

            return Response(user_serializer.data)
        return Response(user_serializer.errors)
class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    #-----------RECORDATORIO
    '''
    Consumir un api de currencys para darle la opcion al usuario
    Y no que lo tenga que escribir
    '''
    def get(self, request):
        
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings, created= UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
class SearchTransactions(APIView):
    permission_classes =[IsAuthenticated]
    def post( self, request):
        data=request.data
        search_term = data.get('search_term', '')
        transactions= Transaction.objects.filter(user= request.user, description__icontains=search_term)
        transactions_serializer= TransactionSerializer(transactions, many=True).data
        return Response(transactions_serializer)