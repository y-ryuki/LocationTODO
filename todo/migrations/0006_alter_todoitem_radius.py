# Generated by Django 4.1 on 2024-12-06 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0005_todoitem_completed_todoitem_radius'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todoitem',
            name='radius',
            field=models.FloatField(default=500.0),
        ),
    ]