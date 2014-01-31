/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'app',
    'models/MealLocation',
    'views/GoogleMapView',
    'lib/jquery.browser-info'
],
function($, Backbone, _, app, MealLocation, GoogleMapView) {
    return Backbone.View.extend({
        id: 'home-page',
        events: {
        },
        $mapInstructions: $('<div id="map-instructions">Pick a summer feeding side below to find some delicious food!</div>'),
        initialize: function(options) {
            var MealLocations = Backbone.Collection.extend({
                model: MealLocation,
                url: '/api/locations/meals/'
            });
            this.mealLocations = new MealLocations([]);
            this.mealLocations.on('sync', this.renderMap, this);

            this.mealLocations.fetch({
                error: function() {
                    var $msg = $('<p id="map-instructions">We\'re sorry, we encountered an unexpected error while attempting to retrieve the current meal locations. Click <a href="javascript:void(0);">here</a> to try again.  If the problem persists, please contact support@nutrislice.com.</p>'),
                        $reloadLink = $msg.find('a');
                    $reloadLink.click(function() {
                        location.reload();
                    });
                    $('#page-content').html($msg);
                }
            });
        },
        render: function() {
            return this;
        },
        getMaxMapHeight: function(mapInstructionsHeight) {
            var maxMapHeight = $(window).height() - mapInstructionsHeight;
            if ($.browser.isIosDevice) {
                if (app.isRunningInWrapperApp) {
                    maxMapHeight -= 20;
                }
                else {
                    if ($.browser.isIos7) {
                        maxMapHeight -= 80;
                    }
                    else
                        maxMapHeight -= 65;
                }
            }
            return maxMapHeight;
        },
        renderMap: function() {
            var $pageContent = $('#page-content');
            $pageContent.html(this.$mapInstructions);
            var mapInstructionsHeight = this.$mapInstructions.outerHeight(),
                maxMapHeight = this.getMaxMapHeight(mapInstructionsHeight),
                mealLocationMapView = new GoogleMapView({
                    markerModels: this.mealLocations.models,
                    maxHeight: maxMapHeight
                });
            $pageContent.append(mealLocationMapView.render().$el);
        }
    });
});