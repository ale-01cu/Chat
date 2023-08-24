# Generated by Django 4.2.4 on 2023-08-23 22:37

import apps.user.helpers
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=255, unique=True, verbose_name='Nombre de Usuario')),
                ('photo', models.ImageField(upload_to=apps.user.helpers.path_image_user_generate, verbose_name='Foto')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('is_staff', models.BooleanField(default=False)),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creado')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Cuenta de Usuario',
                'verbose_name_plural': 'Cuentas de Usuarios',
            },
        ),
    ]
