from django.db import models
from django_google_maps import fields as map_fields
from django.utils.translation import ugettext_lazy as _


class MealLocation(models.Model):
    name = models.CharField(max_length=60)
    address = map_fields.AddressField(max_length=100)
    geolocation = map_fields.GeoLocationField(max_length=50)
    notes = models.TextField(blank=True)


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

MON = 1
TUES = 2
WED = 3
THUR = 4
FRI = 5
SAT = 6
SUN = 7
WEEKDAYS = [
    (MON, _("Monday")),
    (TUES, _("Tuesday")),
    (WED, _("Wednesday")),
    (THUR, _("Thursday")),
    (FRI, _("Friday")),
    (SAT, _("Saturday")),
    (SUN, _("Sunday")),
]
TIME_FORMAT = "%-I:%M%p"


class OperatingHours(models.Model):
    meal_location = models.ForeignKey(MealLocation, related_name='operating_hours')
    weekday_from = models.IntegerField(choices=WEEKDAYS)
    weekday_to = models.IntegerField(choices=WEEKDAYS)
    from_hour = models.TimeField(verbose_name='from')
    to_hour = models.TimeField(verbose_name='to')

    def _get_short_weekday_str(self, weekday_str):
        if (self.weekday_from in [MON, WED, FRI]):
            weekday_from_display_str = weekday_str[0:1]
        elif (self.weekday_from in [TUES, THUR, SAT, SUN]):
            weekday_from_display_str = weekday_str[0:2]
        return weekday_from_display_str

    def get_weekday_from_short_display_str(self):
        weekday_from_display_str = self._get_short_weekday_str(self.get_weekday_from_display())
        return weekday_from_display_str

    def get_weekday_to_short_display_str(self):
        weekday_to_display_str = self._get_short_weekday_str(self.get_weekday_to_display())
        return weekday_to_display_str

    def to_short_string(self):
        weekday_from_display_str = self.get_weekday_from_short_display_str()
        weekday_to_display_str = self.get_weekday_to_short_display_str()
        formatted_from = self.from_hour.strftime(TIME_FORMAT).lower()
        formatted_to = self.to_hour.strftime(TIME_FORMAT).lower()
        if weekday_from_display_str == weekday_to_display_str:
            return '%s %s-%s' % (weekday_from_display_str, formatted_from, formatted_to)
        else:
            return '%s-%s %s-%s' % (weekday_from_display_str, weekday_to_display_str, formatted_from, formatted_to)

    def __unicode__(self):
        return self.to_short_string()