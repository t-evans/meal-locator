/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 * Date: 1/29/14
 */

/* primary serves as a repository for root-level objects, which can easily be loaded from other
 * modules */

define([
    "underscore",
    "backbone"
],
function(_, Backbone) {
    // stuff is added/initialized in mobilemain.js to avoid circular dependencies and DomReady issues.
    return {
        vent: _.extend({}, Backbone.Events)  //global event vent
    };
});
