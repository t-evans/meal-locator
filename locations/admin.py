from django.contrib import admin
from django_google_maps import widgets as map_widgets
from django_google_maps import fields as map_fields
from locations.models import MealLocation

class MealLocationAdmin(admin.ModelAdmin):
    formfield_overrides = {
        map_fields.AddressField: {'widget': map_widgets.GoogleMapsAddressWidget},
    }
    list_display = ('name',)

    class Media:
         js = (
             '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
             'customadmin/js/prevent_enter_backspace.js',
             )

admin.site.register(MealLocation, MealLocationAdmin)