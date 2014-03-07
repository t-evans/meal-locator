/**
 * User: troy
 * Date: 5/12/13
 *
 * Copyright 2013, Nutrislice Inc.  All rights reserved.
 */

var querystringUtils = (function($) {
    var utils = {};

    utils.getValue = function(key, uri) {
        var uri = typeof uri === 'undefined' ? location.href : uri,
            re = new RegExp('^.+' + key + '=([^&]+).*$', 'i'),
            m = re.exec(uri);
        if (m)
            return m[1];
        else
            return null;
    }

    utils.getDelimitedValueAsArray = function(key, delimiter, uri) {
        var delimiter = typeof delimiter === 'undefined' ? ',' : delimiter,
            rawValue = utils.getValue(key, uri);
        if (rawValue == null)
            return [];
        else {
            return rawValue.split(delimiter);
        }
    }

    utils.getDelimitedValueAsIntArray = function(key, delimiter, uri) {
        var arrayValue = utils.getDelimitedValueAsArray(key, delimiter, uri);
        for (var i=0; i<arrayValue.length; i++)
            arrayValue[i] = arrayValue[i]|0; // Convert to ints
        return arrayValue;
    }

    /**
     * Adds or updates the querystring identified by 'key' in the provided uri
     * with the provided value.
     * If a uri is not provided, it will use location.href.
     *
     * @return the updated uri.
     */
    utils.updateParam = function(key, value, uri) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
            uri = typeof uri === 'undefined' ? location.href : uri,
            separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    /**
     * Same as updateQuerystringParam(), only it adds the provided value to
     * the param (comma-delimited-list style), rather than replacing the param.
     */
    utils.addToDelimitedListParam = function(key, value, uri) {
        var currentValue = $.trim(utils.getValue(key, uri)),
            newValue = currentValue.length === 0 ? value : currentValue + ',' + value;
        return utils.updateParam(key, newValue, uri);
    }

    return utils;
})(jQuery);