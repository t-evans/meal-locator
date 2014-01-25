# User: troy
# Date: 1/24/14
#
# Copyright 2014, Nutrislice Inc.  All rights reserved.

from rest_framework import serializers
from rest_framework import fields

class MealLocationSerializer(serializers.Serializer):
    name = fields.CharField(source='name')
    address = fields.CharField(source='address')
    latitude = fields.FloatField(source='geolocation.lat')
    longitude = fields.FloatField(source='geolocation.lon')
