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
                    let prevTrans = {	//Store the previous transition properties
                        "transition": typeof $(currElem).css("transition") === "undefined" ?
                            "" : $(currElem).css("transition"),
                        "-webkit-transition": typeof $(currElem).css("-webkit-transition") === "undefined" ?
                            "" : $(currElem).css("-webkit-transition"),
                        "-o-transition": typeof $(currElem).css("-o-transition") === "undefined" ?
                            "" : $(currElem).css("-o-transition"),
                        "-moz-transition": typeof $(currElem).css("-moz-transition") === "undefined" ?
                            "" : $(currElem).css("-moz-transition")
                    };

                    Utility.addCSS($(currElem), transition);
                    $(currElem).removeClass('scrollshow');

                    setTimeout(function() {	//After the animation, restore the transition properties
                        Utility.addCSS($(currElem), prevTrans);
                    }, transitionTime);
                }
            }
        });
    })();

})();

