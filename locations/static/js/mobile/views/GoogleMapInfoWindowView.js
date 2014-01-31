/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'text!templates/GoogleMapInfoWindowView.jst',
    'text!templates/MobileMapInfoWindowView.jst',
    'lib/jquery.browser-info'
],
function($, Backbone, _, templateText, mobileTemplateText) {
    return Backbone.View.extend({
        id: 'map-info-window',
        events: {
        },
        template: _.template(templateText),
        mobileTemplate: _.template(mobileTemplateText),
        infoWindow: null,
        initialize: function(options) {
            this.mapView = options.mapView;
            this.infoWindow = new google.maps.InfoWindow();
        },
        render: function() {
            return this;
        },
        open: function(mapMarker, markerData) {
            var that = this;
            markerData.lookupAddressByCoords();
            if ($.browser.isMobileDevice) {
                var html = this.mobileTemplate({locationData: markerData}),
                    $currentInfoWindow = $('#map-info-window');

                markerData.off('change:address');
                markerData.on('change:address', function(model, name) {
                    that.$el.find('.address').html(model.address());
                });

                if (!$currentInfoWindow.length) {
                    this.mapView.$el.after(this.$el);
                    this.$el.addClass('mobile');
                }
                this.$el.html(html);
                this.$el.show();
                this.trigger('showMobileInfoWindow');
            }
            else {
                this.openNonMobileInfoWindow(mapMarker, markerData);
                markerData.off('change:address');
                markerData.on('change:address', function(model, name) {
                    that.openNonMobileInfoWindow(mapMarker, model);
                }, this);
            }
        },
        openNonMobileInfoWindow: function(mapMarker, markerData) {
            this.infoWindow.close();
            var html = this.template({locationData: markerData}),
                $html = $(html);
            $('body').append($html);
            $html.height($html.height() + 5);
            var fixedHtml = $('<div>').append($html).html();
            this.infoWindow.setContent(fixedHtml);
            this.infoWindow.open(mapMarker.getMap(), mapMarker);
        },
        close: function() {
            if ($.browser.isMobileDevice){
                var $infoWindow = this.$el;
                $infoWindow.slideDown(200, function() {
                    $infoWindow.remove();
                });
            }
            else
                this.infoWindow.close();
        },
        height: function() {
            var height;
            if ($.browser.isMobileDevice)
                height = this.$el.height();
            else
                height = 0; // Non-mobile info windows are shown directly on the map.
            return height;
        }
    });
});