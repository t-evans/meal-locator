/**
 * Turns any input with the "font-awesome" class into a font-awesome icon selector.
 *
 * It is anticipated that the font-awesome inputs are text fields into which the
 * selected icon definition will be inserted.
 */

(function($) {
    // More icons can be found at http://fontawesome.io/icons/
    var awesomeIconsArray = [
        {
            "label": "Clock",
            "cssClass": "fa fa-clock-o fa-lg"
        },
        {
            "label": "Cutlery",
            "cssClass": "fa fa-cutlery fa-lg"
        },
        {
            "label": "Facebook",
            "cssClass": "fa fa-facebook fa-lg"
        },
        {
            "label": "Facebook Square",
            "cssClass": "fa fa-facebook-square fa-lg"
        },
        {
            "label": "Twitter",
            "cssClass": "fa fa-twitter fa-lg"
        },
        {
            "label": "Twitter Square",
            "cssClass": "fa fa-twitter-square fa-lg"
        },
        {
            "label": "Instagram",
            "cssClass": "fa fa-instagram fa-lg"
        },
        {
            "label": "YouTube",
            "cssClass": "fa fa-youtube fa-lg"
        },
        {
            "label": "Camera",
            "cssClass": "fa fa-camera-retro fa-lg"
        },
        {
            "label": "Calendar",
            "cssClass": "fa fa-calendar fa-lg"
        },
        {
            "label": "Checkmark",
            "cssClass": "fa fa-check fa-lg"
        },
        {
            "label": "Checkmark Square",
            "cssClass": "fa fa-check-square-o fa-lg"
        },
        {
            "label": "Envelope",
            "cssClass": "fa fa-envelope fa-lg"
        },
        {
            "label": "Info",
            "cssClass": "fa fa-info fa-lg"
        },
        {
            "label": "Info Circle",
            "cssClass": "fa fa-info-circle fa-lg"
        },
        {
            "label": "Money",
            "cssClass": "fa fa-money fa-lg"
        },
        {
            "label": "Exclamation",
            "cssClass": "fa fa-exclamation fa-lg"
        },
        {
            "label": "Exclamation Triangle",
            "cssClass": "fa fa-exclamation-triangle fa-lg"
        },
        {
            "label": "Question",
            "cssClass": "fa fa-question fa-lg"
        },
        {
            "label": "Question Circle",
            "cssClass": "fa fa-question-circle fa-lg"
        },
        {
            "label": "Phone",
            "cssClass": "fa fa-phone fa-lg"
        },
        {
            "label": "Phone Square",
            "cssClass": "fa fa-phone-square fa-lg"
        },
        {
            "label": "Download",
            "cssClass": "fa fa-download fa-lg"
        },
        {
            "label": "Flag",
            "cssClass": "fa fa-flag-o fa-lg"
        },
        {
            "label": "Heart",
            "cssClass": "fa fa-heart fa-lg"
        },
        {
            "label": "External Link",
            "cssClass": "fa fa-external-link fa-lg"
        },
        {
            "label": "Comments",
            "cssClass": "fa fa-comments fa-lg"
        },
        {
            "label": "Signal",
            "cssClass": "fa fa-signal fa-lg"
        },
        {
            "label": "Mobile Device",
            "cssClass": "fa fa-mobile fa-lg"
        },
        {
            "label": "Star",
            "cssClass": "fa fa-star fa-lg"
        },
        {
            "label": "Star Outline",
            "cssClass": "fa fa-star-o fa-lg"
        },
        {
            "label": "Moon",
            "cssClass": "fa fa-moon-o fa-lg"
        },
        {
            "label": "Lock",
            "cssClass": "fa fa-lock fa-lg"
        },
        {
            "label": "Bookmark",
            "cssClass": "fa fa-bookmark fa-lg"
        },
        {
            "label": "Bell",
            "cssClass": "fa fa-bell fa-lg"
        },
        {
            "label": "Wheelchair",
            "cssClass": "fa fa-wheelchair fa-lg"
        }
    ];

    $(function(){
        var $dialog = $('<div id="dialog" title="Select an icon"></div>'),
            onIconSelectorClicked = function(event, $textField, $selectedIcon) {
                $dialog.find('.icon-link').unbind('click').click(function() {
                    var $icon = $(this).find('i'),
                        iconClass = $icon.attr('class');
                    $textField.val(iconClass);
                    $selectedIcon.attr('class', iconClass).addClass('fa-2x').show();
                    $dialog.dialog('close');
                });
                $dialog.dialog("open");
                $dialog.find('a').blur();

                event.preventDefault();
            };

        for (var i=0; i<awesomeIconsArray.length; i++) {
            var iconDef = awesomeIconsArray[i],
                $iconLink = $('<a class="icon-link" href="javascript:void(0);"></a>'),
                $icon = $('<i></i>');
            $icon.addClass(iconDef.cssClass);
            $iconLink.append($icon);
            $dialog.append($iconLink);
        }

        $dialog.appendTo($('body'));
        $dialog.dialog({
            autoOpen: false,
            width: 400,
            buttons: [
                {
                    text: "Cancel",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });

        $('input.font-awesome').each(function() {
            var $textField = $(this),
                $iconSelectorImage = $('<span class="ui-icon ui-icon-newwin"></span>'),
                $iconSelectorLink = $('<a href="javascript:void(0);" class="icon-selector-link ui-state-default ui-corner-all"></a>'),
                selectedIconClass = $textField.val(),
                $iconSelector = $('<div class="icon-selector"></div>'),
                $selectedIconWrapper = $('<div class="selected-icon"></div>'),
                $selectedIcon = $('<i></i>');

            $textField.hide();
            $selectedIcon.hide();
            $selectedIconWrapper.append($selectedIcon);
            $iconSelector.append($selectedIconWrapper);
            if (selectedIconClass) {
                $iconSelectorLink.append($iconSelectorImage).append('Change...');
                $selectedIcon.attr('class', selectedIconClass).addClass('fa-2x').show();
            }
            else {
                $iconSelectorLink.append($iconSelectorImage).append('Choose...');
            }
            $iconSelector.append($iconSelectorLink);
            $textField.after($iconSelector);

            $iconSelectorLink.click(function(e) {
                onIconSelectorClicked(e, $textField, $selectedIcon)
            });
        });

        // Listens for if/when a new formset item is added and sets up the icon stuff
        // for the new row.
        // Eventually, an event trigger may be added to django core to handle
        // this: https://code.djangoproject.com/ticket/15760.  For now, we get an
        // ugly, hacky workaround...
        $('#location_detail_sections-group').on('DOMNodeInserted', function(e) {
            var $target = $(e.target);
            if ($target.hasClass('grp-module') && $target.hasClass('grp-tbody')) {
                var $textField = $target.find('.font-awesome'),
                    $selectedIcon = $target.find('.icon-selector').find('i'),
                    $iconSelectorLink = $target.find('.icon-selector-link');
                $iconSelectorLink.off('click');
                $iconSelectorLink.click(function(e) {
                    onIconSelectorClicked(e, $textField, $selectedIcon);
                })
            }
        });
    });
}(jQuery));
