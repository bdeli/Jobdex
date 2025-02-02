from django.db import models
import uuid
#from datetime import datetime
from django.utils import timezone
import user

class Document(models.Model):
    unique_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    doc_name = models.CharField(max_length=255)
    date_uploaded = models.DateTimeField(default=timezone.now())
    pdf = models.FileField(upload_to='documents/', blank=True, null=True)
    uploaded_by = models.ForeignKey(user.models.UserProfile)

    def __str__(self):
        return self.doc_name
