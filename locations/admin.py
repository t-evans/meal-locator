from django.conf import settings
from django.contrib import admin
from django_google_maps import widgets as map_widgets
from django_google_maps import fields as map_fields
from locations.models import MealLocation, OperatingHours


class OperatingHoursInline(admin.TabularInline):
    model = OperatingHours
    extra = 0
    verbose_name = 'Hours of Operation'
    verbose_name_plural = 'Hours of Operation'


class GoogleMapsAddressWidget(map_widgets.GoogleMapsAddressWidget):
    """
    Adds a different jquery version and changes the maps-api import to include the
    "places" library (for autocomplate) and our google API key.
    """
    class Media:
        google_maps_api = 'https://maps.google.com/maps/api/js?sensor=false&libraries=%s&key=%s' \
                          % (settings.ADDITIONAL_GOOGLE_MAPS_LIBRARIES, settings.GOOGLE_API_KEY)
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
            google_maps_api,
            settings.STATIC_URL + 'django_google_maps/js/google-maps-admin.js',
        )
map_widgets.GoogleMapsAddressWidget.Media.js = None # If I leave the JS of the parent class in there, the page ends up getting BOTH that and the above.


class MealLocationAdmin(admin.ModelAdmin):
    formfield_overrides = {
        map_fields.AddressField: {'widget': GoogleMapsAddressWidget},
    }
    list_display = ('name', 'address')
    inlines = (OperatingHoursInline, )

    class Media:
         js = (
             'customadmin/js/prevent_enter_backspace.js',
         )


admin.site.register(MealLocation, MealLocationAdmin)