from django.contrib import admin
from .models import UserAccount

class UserAccountAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'username', 
        'photo', 
        'is_active',
        'is_staff',
        'create_date'
    )
    list_display_links = (
        'id', 
        'username', 
        'photo', 
        'is_active',
        'is_staff',
        'create_date'
    )
    
admin.site.register(UserAccount, UserAccountAdmin)