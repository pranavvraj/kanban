# Generated by Django 3.0.3 on 2025-02-16 00:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kanban', '0002_auto_20250215_0217'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='col',
        ),
    ]
