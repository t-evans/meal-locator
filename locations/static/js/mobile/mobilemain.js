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
    'views/HomeView',
    'lib/fastclick.min',
    'util/querystring-utils'
],
function( $, Backbone, app, HomeView, FastClick) {
    window.app = app;
    app.isRunningInWrapperApp = querystringUtils.getValue('isRunningInWrapperApp') === 'true' || false;

    $(function() {
        FastClick.attach(document.body); // Removes the 300ms delay for the onclick event.
        var homeView = new HomeView();
        //$('#page-content').html(homeView.render().$el);
    });
});