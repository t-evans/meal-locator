/**
 * Copyright 2012, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'app',
    'lib/jockey'
],
function($, Backbone, _, app) {
    return Backbone.View.extend({
        id: 'map-canvas',
        events: {
        },
        map: null,
        markerModels: [],
        allLatitudes: [],
        allLongitudes: [],
        currentLocationMarker: null,
        initialize: function(options) {
            _.bindAll(this, 'updateCurrentPositionOnMap');
            var that = this;
            this.markerModels = options.markerModels;
            that.extractAllLatitudesAndLongitudes();

            Jockey.on("updateUserLocation", function(payload) {
                that.updateCurrentPositionOnMap(that.map, payload);
            });
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
        updateCurrentPositionOnMap: function(map, position, mapDimentions) {
            var updateMapZoomLevel = false;
            if (this.currentLocationMarker === null) {
                this.currentLocationMarker = new google.maps.Marker({
                    clickable: false,
                    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                                    new google.maps.Size(22,22),
                                                                    new google.maps.Point(0,18),
                                                                    new google.maps.Point(11,11)),
                    shadow: null,
                    zIndex: 999,
                    map: map
                });
                updateMapZoomLevel = true;
            }
            var me = new google.maps.LatLng(position.latitude, position.longitude);
            this.currentLocationMarker.setPosition(me);

            if (updateMapZoomLevel) {
                if (typeof mapDimentions === 'undefined') {
                    mapDimentions = {
                        height: this.$el.height() > 0 ? this.$el.height()-15 : $(window).height() - 15,
                        width: this.$el.width() > 0 ? this.$el.width()-15 : $(window).width() - 15
                    };
                }
                this.updateMapZoomLevelToIncludeCurrentUserPosition(map, position, mapDimentions);
            }
        },
        setCurrentLocationIfPossible: function(map, mapDimentions) {
            var that = this;

            // If running in the wrapper app, it will ask for location permission separate
            // from the site (i.e. if the site asks, BOTH will ask), so we'll just let the
            // app control it instead and pass info to the site.
            if (!app.isRunningInWrapperApp) {
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
                    that.updateCurrentPositionOnMap(map, pos.coords, mapDimentions);
                }, function(error) {
                    // Map is already rendered w/o the position. Nothing to do...
                    console.log("Error while retrieving user's current location: " + error);
                }, {
                    timeout: 10000
                });
            }
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
        getBoundsZoomLevel: function(minLatitude, maxLatitude, minLongitude, maxLongitude, mapDim) {
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
            var maxLatRad = latRad(maxLatitude),
                minLatRad = latRad(minLatitude),
                latFraction = (maxLatRad - minLatRad) / Math.PI;

            var lngDiff = maxLongitude - minLongitude;
            var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

            var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
            var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

//            setTimeout(function() {
//                alert('Zoom calculator...\nlatZoom: ' + latZoom + '\nlngZoom: ' + lngZoom
//                 + '\nZOOM_MAX: ' + ZOOM_MAX + '\nlatFraction: ' + latFraction + '\nlngDiff: '
//                 + lngDiff + '\nlngFraction: ' + lngFraction + '\nmaxLatRad: ' + maxLatRad
//                 + '\nminLatRad: ' + minLatRad + '\nmapHeight: ' + mapDim.height + '\nmapWidth: ' + mapDim.width);
//            }, 6000);
            return Math.min(latZoom, lngZoom, ZOOM_MAX);
        },
        calculateAppropriateZoomLevel: function(mapDimentions) {
            var maxLatitude = _.max(this.allLatitudes),
                minLatitude = _.min(this.allLatitudes),
                maxLongitude = _.max(this.allLongitudes),
                minLongitude = _.min(this.allLongitudes),
                zoom = this.getBoundsZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude, mapDimentions);
            return zoom;
        },
        updateMapZoomLevelToIncludeCurrentUserPosition: function(map, currentUserPosition, mapDimentions) {
            this.allLatitudes.push(currentUserPosition.latitude);
            this.allLongitudes.push(currentUserPosition.longitude);
            var zoom = this.calculateAppropriateZoomLevel(mapDimentions);
            map.setZoom(zoom);
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
                    height: this.$el.height() > 0 ? this.$el.height()-15 : $(window).height() - 15,
                    width: this.$el.width() > 0 ? this.$el.width()-15 : $(window).width() - 15
                };
            this.map = map;
            this.addMarkers(this.markerModels, map, infoWindow);
            map.setZoom(this.calculateAppropriateZoomLevel(mapDimentions));
            this.setCurrentLocationIfPossible(map, mapDimentions);
            return this;
        }
    });
});