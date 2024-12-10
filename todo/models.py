from django.db import models

class TodoItem(models.Model):
    CATEGORY_CHOICES = [
        ('work', '仕事'),
        ('personal', '個人'),
        ('other', 'その他'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    radius = models.FloatField(default=500.0)  # 到達範囲（メートル単位）

    def __str__(self):
        return self.title
