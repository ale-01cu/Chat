from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from .helpers import path_image_user_generate

class UserAccountManager(BaseUserManager):
    # Metodo que registra el usuario
    def create_user(self, username, password=None, **extra_fields):
        
        user = self.model(username=username, **extra_fields)
        
        user.set_password(password)
        user.save()
               
        return user
    
    # Metodo que registra el usuario administrador
    def create_superuser(self, username, password=None, **extra_fields):
        user = self.create_user(username, password, **extra_fields)
        
        user.is_superuser = True
        user.is_staff = True
        user.save()
        
        return user
    
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'Cuenta de Usuario'
        verbose_name_plural = 'Cuentas de Usuarios'
    
    username = models.CharField(
        unique=True,
        max_length=255,
        verbose_name='Nombre de Usuario'
    )
    
    photo = models.ImageField(
        verbose_name='Foto',
        upload_to=path_image_user_generate
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo',
    )
    
    is_staff = models.BooleanField(
        default=False,
    )
    
    create_date = models.DateTimeField(
        verbose_name='Fecha de creado',
        auto_now_add=True
    )
    
    objects = UserAccountManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['photo']
    
    def __str__(self):
        return self.username