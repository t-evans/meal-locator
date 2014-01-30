// Set the require.js configuration for the application.
requirejs.config({
    waitSeconds: 90,
    paths: {
        //directories
        lib: "../lib",
        util: "../util",
        models: "../models",

        //libs
        jquery: "../lib/require-jquery.min",
        underscore: "../lib/underscore-min",
        backbone: "../lib/backbone-min",

        //require plugins
        text: "../lib/text",

        // aliases
        app: "mobileapp"

    },
    shim: {  //specify all non-AMD javascript files with AMD or non-AMD dependencies here.
            // no need to shim jquery plugins & extensions if you use the require-jquery.js library
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});


/* from HTML5 Boilerplate: */
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};
// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})

(function(){try{console.log('verifying console.log'); return window.console;}catch(a){return (window.console={});}}());

/****/



require([
    'jquery',
    'backbone',
    'app',
    'models/MealLocation',
    'views/GoogleMapView',
    'lib/fastclick.min',
    'util/querystring-utils'
],
function( $, Backbone, app, MealLocation, GoogleMapView, FastClick) {
    window.app = app;
    app.isRunningInWrapperApp = querystringUtils.getValue('isRunningInWrapperApp') === 'true' || false;

    $(function() {
        FastClick.attach(document.body); // Removes the 300ms delay for the onclick event.
        var MealLocations = Backbone.Collection.extend({
                model: MealLocation,
                url: '/api/locations/meals/'
            }),
            mealLocations = new MealLocations([]);
        mealLocations.fetch({
            success: function(model, response) {
                var mealLocationMapView = new GoogleMapView({markerModels: model.models});
                mealLocationMapView.render();
                //$('#page-content').html(mealLocationMapView.$el); // I haven't had any luck getting the map to render in an other-than-top-level dom element.
                $('body').prepend(mealLocationMapView.$el);
            },
            error: function() {
                var $msg = $('<p>We\'re sorry, we encountered an unexpected error while attempting to retrieve the current meal locations. Click <a href="javascript:void(0);">here</a> to try again.  If the problem persists, please contact support@nutrislice.com.</p>'),
                    $reloadLink = $msg.find('a');
                $reloadLink.click(function() {
                    location.reload();
                });
                $('#page-content').html($msg);
            }
        });
    });
});