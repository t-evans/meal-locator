/**
 * Turns any input with the "font-awesome" class into a font-awesome icon selector.
 *
 * It is anticipated that the font-awesome inputs are text fields into which the
 * selected icon definition will be inserted.
 */

(function($) {
    var awesomeIconsArray = [
        {
            "label": "Clock",
            "cssClass": "fa fa-clock-o fa-lg"
        },
        {
            "label": "Facebook",
            "cssClass": "fa fa-facebook-square fa-lg"
        },
        {
            "label": "Camera",
            "cssClass": "fa fa-camera-retro fa-lg"
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
