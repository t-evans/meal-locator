# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Removing unique constraint on 'OperatingHours', fields ['weekday_from']
        db.delete_unique(u'locations_operatinghours', ['weekday_from'])


    def backwards(self, orm):
        # Adding unique constraint on 'OperatingHours', fields ['weekday_from']
        db.create_unique(u'locations_operatinghours', ['weekday_from'])


    models = {
        u'locations.meallocation': {
            'Meta': {'object_name': 'MealLocation'},
            'address': ('django_google_maps.fields.AddressField', [], {'max_length': '254'}),
            'geolocation': ('django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '254'})
        },
        u'locations.operatinghours': {
            'Meta': {'object_name': 'OperatingHours'},
            'from_hour': ('django.db.models.fields.TimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meal_location': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'operating_hours'", 'to': u"orm['locations.MealLocation']"}),
            'to_hour': ('django.db.models.fields.TimeField', [], {}),
            'weekday_from': ('django.db.models.fields.IntegerField', [], {}),
            'weekday_to': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['locations']