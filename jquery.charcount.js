/*
* charcount - adds a character count to textbox/textarea controls.
*
* http://www.dave-mccall.com/
*
* Usage: <textarea class="charcount-attach" data-format="{current}/{max} characters" 
*           data-warning-length="90" data-max-length="100" data-position="above">[...]</textarea>
*
* position supports "below" and "above"
* format supports {current} {max} {remaining}
*
* Released under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
    $.fn.charcount = function (method) {
        var methods = {
            init: function (options) {
                if (options == null) options = {};
                $(this).each(function () {
					var position = options.position;
					if (position == null) position = $(this).data("position");
					if (position == null) position = $.fn.charcount.defaults.position;
                    var maxLength = options.maxLength;
                    if (maxLength == null) maxLength = $(this).data("max-length");
					if (maxLength == null) maxLength = $.fn.charcount.defaults.maxLength;
                    var warningLength = options.warningLength;
                    if (warningLength == null) warningLength = $(this).data("warning-length");
                    if (warningLength == null && maxLength != null) warningLength = (maxLength * .8);
                    var format = options.format;
					if (format == null) format = $(this).data("format");
                    if (format == null) format = $.fn.charcount.defaults.format;
					$(this).bind("keyup change", function () {
						_charcount_update.call(this);
					}).data({ 
						maxLength: maxLength, 
						warningLength: warningLength, 
						position: position, 
						format: format
					}).removeClass("charcount-attach");
					var count = $("<div class=\"charcount\">");
					if (position == "above")
						$(this).before(count);
					else
						$(this).after(count);
					_charcount_update.call(this);
                });
                return this;
            },
        };
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method)
            return methods["init"].apply(this, arguments);
        else
            $.error("Method " + method + " does not exist in charcount");

    }
	$.fn.charcount.defaults = {
		position: "below",
		maxLength: 100,
		format: "{current}/{max} characters"
	};
	function _charcount_update() {
		var position = $(this).data("position");
		var format = $(this).data("format");
		var maxLength = $(this).data("maxLength");
		var warningLength = $(this).data("warningLength");
		var currentLength = $(this).val().length;
		var invalid = (currentLength > maxLength);
		var warning = (!invalid && currentLength >= warningLength);
		var text = format.replace(/\{current\}/g, currentLength).replace(/\{max\}/g, maxLength).replace(/\{remaining\}/g, maxLength - currentLength);
		var element = (position == "above" ? $(this).prevAll(".charcount") : $(this).nextAll(".charcount"));
		element.text(text).toggleClass("invalid", invalid).toggleClass("warning", warning);
	}
})(jQuery);
$(document).ready(function () {
    $(".charcount-attach").charcount();
});