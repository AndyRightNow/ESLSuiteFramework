/* jshint esversion: 6 */
(function() {
    "use strict";
    //----------------------------
    //	Utility
    //----------------------------
    var Utility = {

        //---------------------------
        //	CSS Class style handler
        //---------------------------
        addCSS: function(jqueryObject, classObject) {
            if (typeof jqueryObject !== "undefined" && typeof classObject !== "undefined") {
                for (let prop in classObject) {
                    jqueryObject.css(prop, classObject[prop]);
                }
            }
        },
        storeInlineCSS: function(jqueryObject) {
            if (typeof jqueryObject !== "undefined") {
                let styleStr = jqueryObject.attr('style');
                return typeof styleStr !== "undefined" ? styleStr : "";
            }
        },
        restoreInlineCSS: function(jqueryObject, styleStr) {
            if (typeof jqueryObject !== "undefined" && typeof styleStr !== "undefined") {
                jqueryObject.attr('style', styleStr);
            }
        }
    };

    //-----------------------------------
    //	Scroll to show with "scrollshow"
    //-----------------------------------
    (function() {
        $(window).on("scroll", function(event) {
            var transitionTime = 600;	//Transition time in millisecond
            var transTimeInSec = transitionTime / 1000;		//Transition time in second

            var transition = { //CSS Class object for showing element
                "transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-webkit-transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-o-transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-moz-transition": "opacity " + transTimeInSec + "s ease-in-out"
            };

            var elements = Array.from($(".scrollshow"));
            var currElem = elements.shift();

            if (currElem !== undefined) {
                var windowBottom = $(window).scrollTop() + $(window).height(),
                    curEleBottom = $(currElem).offset().top + $(currElem).height();

                if (windowBottom >= curEleBottom) {
                    let styleStr = Utility.storeInlineCSS($(currElem));// Store the inline css style

                    Utility.addCSS($(currElem), transition);
                    $(currElem).removeClass('scrollshow');

                    setTimeout(function() {  //After the animation, restore the inline style
                        Utility.restoreInlineCSS($(currElem), styleStr);
                    }, transitionTime - 1);
                }
            }
        });
    })();

})();

