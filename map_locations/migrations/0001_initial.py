# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MapLocation'
        db.create_table(u'map_locations_maplocation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=60)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('geolocation', self.gf('django.contrib.gis.db.models.fields.PointField')()),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal(u'map_locations', ['MapLocation'])

        # Adding model 'LocationDetailSection'
        db.create_table(u'map_locations_locationdetailsection', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('map_location', self.gf('django.db.models.fields.related.ForeignKey')(related_name='location_detail_sections', to=orm['map_locations.MapLocation'])),
            ('header', self.gf('django.db.models.fields.CharField')(max_length=40, blank=True)),
            ('sub_header', self.gf('django.db.models.fields.CharField')(max_length=80, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('icon', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
        ))
        db.send_create_signal(u'map_locations', ['LocationDetailSection'])


    def backwards(self, orm):
        # Deleting model 'MapLocation'
        db.delete_table(u'map_locations_maplocation')

        # Deleting model 'LocationDetailSection'
        db.delete_table(u'map_locations_locationdetailsection')


    models = {
        u'map_locations.locationdetailsection': {
            'Meta': {'ordering': "['order']", 'object_name': 'LocationDetailSection'},
            'header': ('django.db.models.fields.CharField', [], {'max_length': '40', 'blank': 'True'}),
            'icon': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'map_location': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'location_detail_sections'", 'to': u"orm['map_locations.MapLocation']"}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'sub_header': ('django.db.models.fields.CharField', [], {'max_length': '80', 'blank': 'True'})
        },
        u'map_locations.maplocation': {
            'Meta': {'object_name': 'MapLocation'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'geolocation': ('django.contrib.gis.db.models.fields.PointField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        }
    }

    complete_apps = ['map_locations']