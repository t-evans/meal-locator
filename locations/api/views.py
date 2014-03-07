# User: troy
# Date: 1/24/14
#
# Copyright 2014, Nutrislice Inc.  All rights reserved.
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework.renderers import JSONRenderer, JSONPRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from locations.models import MapLocation
from locations.api.serializers import *


class BaseAPIMixin(object):
    renderer_classes = JSONRenderer, JSONPRenderer, BrowsableAPIRenderer


class BaseAPIView(BaseAPIMixin, APIView):
    pass


class MapLocationAPIView(BaseAPIMixin, ListAPIView):
    model = MapLocation
    model_serializer_class = MapLocationSerializer

    def get_queryset(self):
        near = self.request.QUERY_PARAMS.get('near', None)
        if near is None:
            raise Exception('"near" is a required querysting parameter when looking up map locations')
        else:
            y, x = near.split(',')
            x = float(x)
            y = float(y)
            point = Point(x, y);
            queryset = self.model.objects.filter(active=True, geolocation__distance_lt=(point, D(mi=75)))
            return queryset