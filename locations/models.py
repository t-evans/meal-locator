from django.db import models
from django_google_maps import fields as map_fields

class MealLocation(models.Model):
    name = models.CharField(max_length=254)
    address = map_fields.AddressField(max_length=254)
    geolocation = map_fields.GeoLocationField(max_length=100)


