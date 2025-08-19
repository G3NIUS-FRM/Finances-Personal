from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# ---------------------------
# Usuario con foto de perfil
# ---------------------------
class User(AbstractUser):
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True,
        help_text="Foto de perfil del usuario"
    )


    def __str__(self):
        return self.username


# ---------------------------
# Categorías para organizar ingresos/gastos
# ---------------------------
class Category(models.Model):
    CATEGORY_TYPES = [
        ('income', 'Ingreso'),
        ('expense', 'Gasto'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=7, choices=CATEGORY_TYPES)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


# ---------------------------
# Transacciones (Ingresos y Gastos)
# ---------------------------
class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.category} - {self.amount} ({self.date})"


# ---------------------------
# Reportes / Estadísticas
# ---------------------------
class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reports")
    start_date = models.DateField()
    end_date = models.DateField()
    total_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_expense = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def balance(self):
        return self.total_income - self.total_expense

    def __str__(self):
        return f"Reporte {self.start_date} → {self.end_date}"


# ---------------------------
# Configuraciones del usuario
# ---------------------------
class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    currency = models.CharField(max_length=10, default="USD")
    monthly_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Configuraciones de {self.user.username}"
