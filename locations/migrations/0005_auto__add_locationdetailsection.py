# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'LocationDetailSection'
        db.create_table(u'locations_locationdetailsection', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('meal_location', self.gf('django.db.models.fields.related.ForeignKey')(related_name='location_detail_sections', to=orm['locations.MealLocation'])),
            ('header', self.gf('django.db.models.fields.CharField')(max_length=40, blank=True)),
            ('sub_header', self.gf('django.db.models.fields.CharField')(max_length=80, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'locations', ['LocationDetailSection'])


    def backwards(self, orm):
        # Deleting model 'LocationDetailSection'
        db.delete_table(u'locations_locationdetailsection')


    models = {
        u'locations.locationdetailsection': {
            'Meta': {'object_name': 'LocationDetailSection'},
            'header': ('django.db.models.fields.CharField', [], {'max_length': '40', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meal_location': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'location_detail_sections'", 'to': u"orm['locations.MealLocation']"}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'sub_header': ('django.db.models.fields.CharField', [], {'max_length': '80', 'blank': 'True'})
        },
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