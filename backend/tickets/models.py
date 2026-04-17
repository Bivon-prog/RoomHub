from django.db import models
from users.models import User
from properties.models import Property


class Ticket(models.Model):
    CATEGORY_CHOICES = [
        ('maintenance', 'Maintenance'),
        ('complaint', 'Complaint'),
        ('compliment', 'Compliment'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='tickets')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.status}] {self.subject}"
