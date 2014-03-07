from django.db import models
from django.contrib.gis.db import models as gis_models


class MealLocation(gis_models.Model):
    name = models.CharField(max_length=60)
    active = models.BooleanField(default=True)
    address = models.CharField(max_length=100)
    geolocation = gis_models.PointField()
    notes = models.TextField(blank=True)

    objects = gis_models.GeoManager()

    def __unicode__(self):
        return self.name


class LocationDetailSection(models.Model):
    meal_location = models.ForeignKey(MealLocation, related_name='location_detail_sections')
    header = models.CharField(max_length=40, blank=True, verbose_name='title')
    sub_header = models.CharField(max_length=80, blank=True, verbose_name='light-gray text')
    notes = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField()
    icon = models.CharField(max_length=30, blank=True)  # Ultimately will hold the font-awesome icon config

    class Meta:
        verbose_name = 'detail section'
        verbose_name_plural = 'details'
        ordering = ['order']
