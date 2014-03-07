/**
 * User: troy
 *
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */

// No need to wait for dom readiness - some things need browser
// info before the dom is ready.
var userAgentLowerCase = navigator.userAgent.toLowerCase();
$.browser.isMobileDevice = (/android|webos|iphone|ipad|ipod|blackberry/i.test(userAgentLowerCase));
$.browser.isAndroidDevice = (/android/i.test(userAgentLowerCase));
$.browser.isIosDevice = (/iphone|ipad|ipod/i.test(userAgentLowerCase));
$.browser.isIos7 = $.browser.isIosDevice && (/os 7_/i.test(userAgentLowerCase));

$.browser.iosAppAvailable = (/iphone|ipod/i.test(userAgentLowerCase));
$.browser.androidAppAvailable = $.browser.isAndroidDevice && (/mobile/i.test(userAgentLowerCase));

$.browser.isMobilesiteFriendly = $.browser.iosAppAvailable || $.browser.androidAppAvailable;
$.browser.isTablet = (/ipad/i.test(userAgentLowerCase)) || ($.browser.isAndroidDevice && !$.browser.androidAppAvailable);
$.browser._androidVersionStartIndex = userAgentLowerCase.indexOf('android')+8;
$.browser.androidVersion = $.browser.isAndroidDevice ? userAgentLowerCase.slice($.browser._androidVersionStartIndex, $.browser._androidVersionStartIndex+5) : '';
$.browser.isAndroid40 = $.browser.androidVersion.indexOf('4.0') >= 0;
$.browser.isAndroid2x = $.browser.androidVersion.indexOf('2.') == 0;
$.browser.isAndroid3x = $.browser.androidVersion.indexOf('3.') == 0;