# User: troy
# Date: 1/24/14
#
# Copyright 2014, Nutrislice Inc.  All rights reserved.
from rest_framework.renderers import JSONRenderer, JSONPRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from locations.models import MealLocation
from locations.api.serializers import *


class BaseAPIMixin(object):
    renderer_classes = JSONRenderer, JSONPRenderer, BrowsableAPIRenderer


class BaseAPIView(BaseAPIMixin, APIView):
    pass


class MealLocationAPIView(BaseAPIMixin, ListAPIView):
    model = MealLocation
    model_serializer_class = MealLocationSerializer

    def get_queryset(self):
        queryset = self.model.objects.filter(active=True)
        return queryset