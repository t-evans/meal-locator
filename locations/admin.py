from django import forms
from django.core import validators
from django.conf import settings
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from locations.models import *


class LatLongWidget(forms.MultiWidget):
    """
    A Widget that splits Point input into two latitude/longitude boxes.
    """

    def __init__(self, attrs=None, date_format=None, time_format=None):
        widgets = (forms.TextInput(attrs=attrs),
                   forms.TextInput(attrs=attrs))
        super(LatLongWidget, self).__init__(widgets, attrs)

    def decompress(self, value):
        if value:
            return tuple(reversed(value.coords))
        return (None, None)


class LatLongField(forms.MultiValueField):

    widget = LatLongWidget
    srid = 4326 # See https://docs.djangoproject.com/en/dev/ref/contrib/gis/model-api/#selecting-an-srid

    default_error_messages = {
        'invalid_latitude': _('Enter a valid latitude.'),
        'invalid_longitude': _('Enter a valid longitude.'),
    }

    def __init__(self, *args, **kwargs):
        fields = (forms.FloatField(min_value=-90, max_value=90),
                  forms.FloatField(min_value=-180, max_value=180))
        super(LatLongField, self).__init__(fields, *args, **kwargs)

    def compress(self, data_list):
        if data_list:
            # Raise a validation error if latitude or longitude is empty
            # (possible if LatLongField has required=False).
            if data_list[0] in validators.EMPTY_VALUES:
                raise forms.ValidationError(self.error_messages['invalid_latitude'])
            if data_list[1] in validators.EMPTY_VALUES:
                raise forms.ValidationError(self.error_messages['invalid_longitude'])
            # SRID=4326;POINT(1.12345789 1.123456789)
            srid_str = 'SRID=%d'%self.srid
            point_str = 'POINT(%r %r)'%tuple(reversed(data_list))
            return ';'.join([srid_str, point_str])
        return None


class MealLocationForm(forms.ModelForm):
    geolocation = LatLongField()


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
    list_display = ('name', 'address', 'active')
    list_editable = ('active',)
    inlines = (LocationDetailsSectionInline, )
    form = MealLocationForm

    class Media:
        css = {
            "all": (
                # For icon picker
                'css/jquery-ui-dialog.min.css',
                'css/meal-location-editor.css',
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