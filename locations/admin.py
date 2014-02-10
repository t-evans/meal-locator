from django.conf import settings
from django.contrib import admin
from locations.models import *


class OperatingHoursInline(admin.TabularInline):
    model = OperatingHours
    extra = 0
    verbose_name = 'Hours of Operation'
    verbose_name_plural = 'Hours of Operation'


class LocationDetailsSectionInline(admin.TabularInline):
    model = LocationDetailSection
    sortable_field_name = 'order'
    extra = 0
    ordering = ['order']


class MealLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    inlines = (LocationDetailsSectionInline, )

    class Media:
        google_maps_api = 'https://maps.google.com/maps/api/js?sensor=false&libraries=%s&key=%s' \
                          % (settings.ADDITIONAL_GOOGLE_MAPS_LIBRARIES, settings.GOOGLE_API_KEY)
        js = (
            'customadmin/js/make_jquery_available_to_plugins.js',
            google_maps_api,
            'customadmin/js/jquery.geocomplete.min.js',
            'customadmin/js/location_editor.js',
            'customadmin/js/hide_inline_position_column.js',
            'customadmin/js/prevent_enter_backspace.js',
        )

admin.site.register(MealLocation, MealLocationAdmin)