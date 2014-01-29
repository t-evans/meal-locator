/**
 * Copyright 2012, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'app'
],
function($, Backbone, app) {
    return Backbone.View.extend({
        id: 'map-canvas',
        events: {
        },
        markerModels: [],
        allLatitudes: [],
        allLongitudes: [],
        initialize: function(options) {
            var that = this;
            this.markerModels = options.markerModels;
            that.extractAllLatitudesAndLongitudes();
        },
        extractAllLatitudesAndLongitudes: function() {
            this.allLatitudes = this.markerModels.map(function(model) {
                return model.latitude();
            });
            this.allLatitudes = _.without(this.allLatitudes, null);

            this.allLongitudes = this.markerModels.map(function(model) {
                return model.longitude();
            });
            this.allLongitudes = _.without(this.allLongitudes, null);
        },
        addMarker: function(markerModel, map, infoWindow) {
            var position = new google.maps.LatLng(markerModel.latitude(), markerModel.longitude()),
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: markerModel.name()
                });
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.close()

                var $infoWindowContent = $(infoWindow.getContent()),
                    $title = $infoWindowContent.find('#title');
                $title.html(marker.title);
                $infoWindowContent.height($infoWindowContent.height());
                $infoWindowContent.show();
                infoWindow.open(map, marker);
            });
        },
        addMarkers: function(markerModels, map, infoWindow) {
            for (var i=0; i<markerModels.length; i++) {
                var markerModel = markerModels[i];
                this.addMarker(markerModel, map, infoWindow);
            }
        },
        setCurrentLocationIfPossible: function(map, mapDimentions) {
            var that = this;
            // Ask for permission to use current location.
            // Things to note:
            //   1 - If they've given permission in the past, it may or may not ask them again.
            //   2 - If they've given permission in the past it may or may not call EITHER callback function.
            //   3 - The page does not wait for the user to give/deny permission before continuing to render.
            if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
                var myloc = new google.maps.Marker({
                    clickable: false,
                    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                                    new google.maps.Size(22,22),
                                                                    new google.maps.Point(0,18),
                                                                    new google.maps.Point(11,11)),
                    shadow: null,
                    zIndex: 999,
                    map: map
                });

                var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                myloc.setPosition(me);

                that.updateMapZoomLevelToIncludeCurrentUserPosition(map, pos, mapDimentions);
            }, function(error) {
                // Map is already rendered w/o the position. Nothing to do...
            });
        },
        getAverageValues: function(arr) {
            if (!arr || arr.length === 0)
                return 0;

            return _.reduce(arr, function(currentSum, nextValue) {
                return currentSum + nextValue;
            }, 0) / arr.length;
        },
        calculateCenterOfMarkers: function() {
            var averageLatitude = this.getAverageValues(this.allLatitudes),
                averageLongitude = this.getAverageValues(this.allLongitudes);
            return new google.maps.LatLng(averageLatitude,averageLongitude);
        },
        getBoundsZoomLevel: function(bounds, mapDim) {
            // Uses technique from http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds#answer-13274361
            var WORLD_DIM = { height: 256, width: 256 };
            var ZOOM_MAX = 21;

            function latRad(lat) {
                var sin = Math.sin(lat * Math.PI / 180);
                var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
                return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
            }

            function zoom(mapPx, worldPx, fraction) {
                return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
            }

            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();

            var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

            var lngDiff = ne.lng() - sw.lng();
            var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

            var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
            var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

            return Math.min(latZoom, lngZoom, ZOOM_MAX);
        },
        calculateAppropriateZoomLevel: function(mapDimentions) {
            var maxLatitude = _.max(this.allLatitudes),
                minLatitude = _.min(this.allLatitudes),
                maxLongitude = _.max(this.allLongitudes),
                minLongitude = _.min(this.allLongitudes),
                sw = new google.maps.LatLng(minLatitude, minLongitude),
                ne = new google.maps.LatLng(maxLatitude, maxLongitude),
                bounds = new google.maps.LatLngBounds(sw, ne),
                zoom = this.getBoundsZoomLevel(bounds, mapDimentions);
            return zoom;
        },
        updateMapZoomLevelToIncludeCurrentUserPosition: function(map, currentUserPosition, mapDimentions) {
            this.allLatitudes.push(currentUserPosition.coords.latitude);
            this.allLongitudes.push(currentUserPosition.coords.longitude);
            map.setZoom(this.calculateAppropriateZoomLevel(mapDimentions));
            map.setCenter(this.calculateCenterOfMarkers());
        },
        render: function() {
            var mapOptions = {
                    center: this.calculateCenterOfMarkers()
                },
                map = new google.maps.Map(this.el, mapOptions),
                //map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions),
                $infoWindowContent = $('#info-window'),
                infoWindow = new google.maps.InfoWindow({
                    content: $infoWindowContent.get(0)
                }),
                mapDimentions = {
                    height: $(window).height()-15,
                    width: $(window).width()-15
                };
            this.addMarkers(this.markerModels, map, infoWindow);
            map.setZoom(this.calculateAppropriateZoomLevel(mapDimentions));
            this.setCurrentLocationIfPossible(map, mapDimentions);
            return this;
        }
    });
});