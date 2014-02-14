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
        var $dialog = $('<div id="dialog" title="Select an icon"></div>');
        for (var i=0; i<awesomeIconsArray.length; i++) {
            var iconDef = awesomeIconsArray[i],
                $iconLink = $('<a class="icon-link" href="javascript:void(0);"></a>'),
                $icon = $('<i></i>');
            $iconLink.css('padding', '5px');
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
                $iconSelectorLink = $('<a href="javascript:void(0);" id="icon-selector-link" class="ui-state-default ui-corner-all"></a>'),
                selectedIconClass = $textField.val(),
                $iconSelector = $('<div class="icon-selector"></div>'),
                $selectedIconWrapper = $('<div class="selected-icon"></div>'),
                $selectedIcon = $('<i></i>'),
                $clearSelectedIconLink = $('<i class="clear-selected-icon fa fa-minus-circle"></i>');

            $textField.hide();
            $selectedIcon.hide();
            $selectedIconWrapper.append($selectedIcon);
            $selectedIconWrapper.append($clearSelectedIconLink);
            $iconSelector.append($selectedIconWrapper);
            if (selectedIconClass) {
                $iconSelectorLink.append($iconSelectorImage).append('Change...');
                $selectedIcon.attr('class', selectedIconClass).show();
            }
            else {
                $iconSelectorLink.append($iconSelectorImage).append('Choose...');
            }
            $iconSelector.append($iconSelectorLink);
            $textField.after($iconSelector);

            $iconSelectorLink.click(function(event) {
                $dialog.find('.icon-link').unbind('click').click(function() {
                    var $icon = $(this).find('i'),
                        iconClass = $icon.attr('class');
                    $textField.val(iconClass);
                    $selectedIcon.attr('class', iconClass).show();
                    $dialog.dialog('close');
                });
                $dialog.dialog("open");
                $dialog.find('a').blur();

                event.preventDefault();
            });
        });
    });
}(jQuery));
