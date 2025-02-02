from django.db import models
import uuid

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(default="")

class Deck(models.Model):
    unique_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    associated_company = models.ForeignKey(Company)
    owner = models.ForeignKey('user.UserProfile')

    def __str__(self):
        return "A card for " + self.status

#Position
class Card(models.Model):
    card_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    job_title = models.CharField(max_length=255, blank=False)
    status = models.CharField(max_length=20, blank=False, default="interested")
    notes = models.TextField(default="")
    card_deck = models.ForeignKey(Deck)
    documents_submitted = models.ManyToManyField('document.Document')

class Tag(models.Model):
    tag = models.CharField(max_length=100)
    tagged_card = models.ForeignKey(Card)

    def __str__(self):
        return self.tag

class Contact(models.Model):
    name = models.CharField(max_length=255, blank=False)
    phone = models.CharField(max_length=255, blank=False)
    email = models.EmailField()
    associated_card = models.ForeignKey(Card)

    def __str__(self):
        return "Contact with name " + self.name

class Task(models.Model):
    task = models.CharField(max_length=100)
    status = models.BooleanField(default=False)
    associated_card = models.ForeignKey(Card)

    def __str__(self):
        return self.task
