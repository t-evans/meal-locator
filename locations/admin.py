from django.conf import settings
from django.contrib import admin
from locations.models import MealLocation, OperatingHours


class OperatingHoursInline(admin.TabularInline):
    model = OperatingHours
    extra = 0
    verbose_name = 'Hours of Operation'
    verbose_name_plural = 'Hours of Operation'


class MealLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    inlines = (OperatingHoursInline, )

    class Media:
        google_maps_api = 'https://maps.google.com/maps/api/js?sensor=false&libraries=%s&key=%s' \
                          % (settings.ADDITIONAL_GOOGLE_MAPS_LIBRARIES, settings.GOOGLE_API_KEY)
        js = (
            'customadmin/js/make_jquery_available_to_plugins.js',
            google_maps_api,
            'customadmin/js/jquery.geocomplete.min.js',
            'customadmin/js/location_editor.js',
            'customadmin/js/prevent_enter_backspace.js',
        )

admin.site.register(MealLocation, MealLocationAdmin)