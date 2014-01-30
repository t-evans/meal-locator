/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'text!templates/GoogleMapInfoWindowView.jst'
],
function($, Backbone, _, templateText) {
    return Backbone.View.extend({
        events: {
        },
        template: _.template(templateText),
        infoWindow: null,
        initialize: function(options) {
            this.mapView = options.mapView;
            this.infoWindow = new google.maps.InfoWindow();
        },
        render: function() {
            return this;
        },
        open: function(mapMarker, markerData) {
            this.infoWindow.close();
            var html = this.template(markerData);
            this.infoWindow.setContent(html);
            this.infoWindow.open(mapMarker.getMap(), mapMarker);

            this.trigger('show');
        },
        close: function() {
            this.infoWindow.close();
        }
    });
});