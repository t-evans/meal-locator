# User: troy
# Date: 1/24/14
#
# Copyright 2014, Nutrislice Inc.  All rights reserved.

from rest_framework import serializers
from rest_framework import fields
from map_locations.models import *


class LocationDetailsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationDetailSection
        fields = ('order', 'header', 'sub_header', 'icon', 'notes')


class MapLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapLocation
        fields = ('id', 'name', 'address', 'latitude', 'longitude', 'location_detail_sections')
    latitude = fields.FloatField(source='geolocation.y')
    longitude = fields.FloatField(source='geolocation.x')
    location_detail_sections = LocationDetailsSectionSerializer(many=True)