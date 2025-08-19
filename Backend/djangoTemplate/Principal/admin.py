from django.contrib import admin
from .models import User, Transaction, Report, UserSettings, Category
# Register your models here.
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Report)
admin.site.register(UserSettings)
admin.site.register(Category)