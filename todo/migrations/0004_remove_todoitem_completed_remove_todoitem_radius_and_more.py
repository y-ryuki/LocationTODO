# Generated by Django 5.1.1 on 2024-11-22 10:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_alter_todoitem_options_remove_todoitem_completed_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todoitem',
            name='completed',
        ),
        migrations.RemoveField(
            model_name='todoitem',
            name='radius',
        ),
        migrations.RemoveField(
            model_name='todoitem',
            name='updated_at',
        ),
    ]
