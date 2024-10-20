from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    # Project attributes
    STATUS_CHOICES = [
        ('in progress', 'In Progress'),
        ('done', 'Done'),
        ('abandoned', 'Abandoned'),
        ('canceled', 'Canceled')
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('mid', 'Mid'),
        ('high', 'High')
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='mid')

    # Foreign Keys to track project ownership and assignment
    created_by = models.ForeignKey(User, related_name='created_projects', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='assigned_projects', on_delete=models.SET_NULL, null=True, blank=True)

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
