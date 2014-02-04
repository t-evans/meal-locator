from datetime import datetime
from django.db import models
from django_google_maps import fields as map_fields
from django.utils.translation import ugettext_lazy as _


class MealLocation(models.Model):
    name = models.CharField(max_length=254)
    address = map_fields.AddressField(max_length=254)
    geolocation = map_fields.GeoLocationField(max_length=100)


WEEKDAYS = [
    (1, _("Monday")),
    (2, _("Tuesday")),
    (3, _("Wednesday")),
    (4, _("Thursday")),
    (5, _("Friday")),
    (6, _("Saturday")),
    (7, _("Sunday")),
]
TIME_FORMAT = "%-I:%M%p"


class OperatingHours(models.Model):
    meal_location = models.ForeignKey(MealLocation, related_name='operating_hours')
    weekday_from = models.IntegerField(choices=WEEKDAYS, unique=True)
    weekday_to = models.IntegerField(choices=WEEKDAYS)
    from_hour = models.TimeField(verbose_name='from')
    to_hour = models.TimeField(verbose_name='to')

    def __unicode__(self):
        formatted_from = self.from_hour.strftime(TIME_FORMAT)
        formatted_to = self.to_hour.strftime(TIME_FORMAT)
        return '%s-%s %s-%s' % (self.get_weekday_from_display(), self.get_weekday_to_display(), formatted_from, formatted_to)