# User: troy
# Date: 1/24/14
#
# Copyright 2014, Nutrislice Inc.  All rights reserved.

from rest_framework import serializers
from rest_framework import fields
from locations.models import MealLocation


class MealLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLocation
        fields = ('id', 'name', 'address', 'geolocation', 'latitude', 'longitude', 'hours_of_operation')
    latitude = fields.FloatField(source='geolocation.lat')
    longitude = fields.FloatField(source='geolocation.lon')
    hours_of_operation = serializers.SerializerMethodField('operating_hours_list')

    def operating_hours_list(self, meal_location):
        operating_hours_list = []
        for operating_hours_def in meal_location.operating_hours.all():
            operating_hours_list.append(operating_hours_def.to_short_string())
        return operating_hours_list