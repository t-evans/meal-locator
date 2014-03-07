/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'text!templates/GoogleMapInfoWindowView.jst',
    'text!templates/MobileMapInfoWindowView.jst',
    'text!templates/LocationDetailSectionView.jst',
    'lib/jquery.browser-info'
],
function($, Backbone, _, templateText, mobileTemplateText, locationDetailSectionText) {
    var distanceMatrixService  = new google.maps.DistanceMatrixService();
    return Backbone.View.extend({
        id: 'map-info-window',
        events: {
            'click .get-directions-btn': 'getDirections'
        },
        template: _.template(templateText),
        mobileTemplate: _.template(mobileTemplateText),
        locationDetailSectionTemplate: _.template(locationDetailSectionText),
        infoWindow: null,
        isRunningOnMobileDevice: function() {
            return true; // We'll treat the main UI the same as the mobile, for now.
            //return $.browser.isMobileDevice;
        },
        initialize: function(options) {
            this.mapView = options.mapView;
            this.infoWindow = new google.maps.InfoWindow();
        },
        render: function() {
            return this;
        },
        _addAdditionalDetailsSection: function(markerData) {
            var locationDetailsSections = markerData.get('location_detail_sections');
            if (locationDetailsSections.length) {
                var $lineSeparator = $('<div class="line-separator"></div>'),
                    $additionalDetailsHeader = $('<h1 class="title">Additional Details</h1>'),
                    $locationDetailsTable = $('<table class="additional-details-box" cellpadding="0" cellspacing="0"></table>');
                for (var i=0; i<locationDetailsSections.length; i++) {
                    var locationDetail = locationDetailsSections[i],
                        locationDetailHtml = this.locationDetailSectionTemplate({locationDetail: locationDetail});
                    $locationDetailsTable.append(locationDetailHtml);
                }
                this.$el.append($lineSeparator).append($additionalDetailsHeader).append($locationDetailsTable);
            }
        },
        open: function(mapMarker, markerData) {
            var that = this;
            //markerData.lookUpAddressByCoords();
            if (that.isRunningOnMobileDevice()) {
                var infoWindowHtml = this.mobileTemplate({locationData: markerData})
                    $currentInfoWindow = $('#map-info-window');

                markerData.off('change:address');
                markerData.on('change:address', function(model, name) {
                    that.$el.find('.address').html(model.address());
                });

                if (!$currentInfoWindow.length) {
                    this.mapView.$el.after(this.$el);
                    this.$el.addClass('mobile');
                }
                this.$el.html(infoWindowHtml);
                this._addAdditionalDetailsSection(markerData);
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
            this.updateDistanceSection(markerData);
        },
        updateDistanceSection: function(markerData) {
            var that = this,
                currentUserPosition = this.mapView.getCurrentPosition();
            if (currentUserPosition) {
                var currentPositionStr = currentUserPosition.toString(),
                    destinationStr = markerData.positionStr(),
                    distanceRequest = {
                        origins: [currentUserPosition],
                        destinations: [new google.maps.LatLng(markerData.latitude(), markerData.longitude())],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.IMPERIAL
                    };
                distanceMatrixService.getDistanceMatrix(distanceRequest, function(response, status) {
                    if (status == google.maps.DistanceMatrixStatus.OK) {
                        var distanceStr = response.rows[0].elements[0].distance.text;
                        that.$('.distance-from-user').html(distanceStr + ' away').show();
                    }
                    else {
                        console.log('Unable to get distance to marker: ' + status);
                    }
                });
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
            if (this.isRunningOnMobileDevice()){
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
            if (this.isRunningOnMobileDevice())
                height = this.$el.height();
            else
                height = 0; // Non-mobile info windows are shown directly on the map.
            return height;
        },
        getDirections: function(event) {
            try {
                var $btn = $(event.target),
                    addressStr = this.$('.address').html().replace('<br>', ', '),
                    //destinationStr = $btn.data('position'),
                    directionsUrl = 'http://maps.google.com/maps?daddr=' + addressStr,
                    currentUserPosition = this.mapView.getCurrentPosition();
                if (currentUserPosition)
                    directionsUrl += '&saddr=' + currentUserPosition.toString();
                if (app.isRunningInMobileApp)
                    directionsUrl += '&openInNewWindow=true';
                window.open(directionsUrl, target="_blank");
            }
            catch(e) {
                console.log('Encountered error while attempting to look up directions: ' + e);
            }
        }
    });
});