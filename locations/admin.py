from django import forms
from django.conf import settings
from django.contrib import admin
from locations.models import *


class OperatingHoursInline(admin.TabularInline):
    model = OperatingHours
    extra = 0
    verbose_name = 'Hours of Operation'
    verbose_name_plural = 'Hours of Operation'


class LocationDetailsSectionForm(forms.ModelForm):
    class Meta:
        model = LocationDetailSection
        fields = ('header', 'sub_header', 'notes', 'order', 'icon')
    icon = forms.CharField(widget=forms.TextInput(attrs={'class':'font-awesome'}), label='icon', required=False)


class LocationDetailsSectionInline(admin.TabularInline):
    model = LocationDetailSection
    form = LocationDetailsSectionForm
    sortable_field_name = 'order'
    extra = 0
    ordering = ['order']


class MealLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    inlines = (LocationDetailsSectionInline, )

    class Media:
        css = {
            "all": (
                # For icon picker
                'css/jquery-ui-dialog.min.css',
                'css/icon-selector.css',
                'font_awesome/css/font-awesome.css',
            )
        }
        google_maps_api = 'https://maps.google.com/maps/api/js?sensor=false&libraries=%s&key=%s' \
                          % (settings.ADDITIONAL_GOOGLE_MAPS_LIBRARIES, settings.GOOGLE_API_KEY)
        js = (
            'customadmin/js/make_jquery_available_to_plugins.js',
            google_maps_api,
            'customadmin/js/jquery.geocomplete.min.js',
            'customadmin/js/location_editor.js',
            'customadmin/js/hide_inline_position_column.js',

            # For icon picker
            'customadmin/js/jquery-ui-dialog.min.js',
            'customadmin/js/add_fontawesome_icon_picker.js',

            'customadmin/js/prevent_enter_backspace.js',
        )

admin.site.register(MealLocation, MealLocationAdmin)