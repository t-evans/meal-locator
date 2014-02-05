# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'MealLocation.notes'
        db.add_column(u'locations_meallocation', 'notes',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)


        # Changing field 'MealLocation.name'
        db.alter_column(u'locations_meallocation', 'name', self.gf('django.db.models.fields.CharField')(max_length=60))

        # Changing field 'MealLocation.address'
        db.alter_column(u'locations_meallocation', 'address', self.gf('django_google_maps.fields.AddressField')(max_length=100))

    def backwards(self, orm):
        # Deleting field 'MealLocation.notes'
        db.delete_column(u'locations_meallocation', 'notes')


        # Changing field 'MealLocation.name'
        db.alter_column(u'locations_meallocation', 'name', self.gf('django.db.models.fields.CharField')(max_length=254))

        # Changing field 'MealLocation.address'
        db.alter_column(u'locations_meallocation', 'address', self.gf('django_google_maps.fields.AddressField')(max_length=254))

    models = {
        u'locations.meallocation': {
            'Meta': {'object_name': 'MealLocation'},
            'address': ('django_google_maps.fields.AddressField', [], {'max_length': '100'}),
            'geolocation': ('django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
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