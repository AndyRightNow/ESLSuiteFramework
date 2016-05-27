/* jshint esversion: 6 */

$(document).ready(() => {
    "use strict";
    //----------------------------
    //  Utility namespace
    //----------------------------
    var Utility = {
        //---------------------------------------
        //  Add CSS Class object to the DOM
        //---------------------------------------
        addCSS: function(jqueryObject, classObject) {
            if (typeof jqueryObject !== "undefined" && typeof classObject !== "undefined") {
                for (let prop in classObject) {
                    jqueryObject.css(prop, classObject[prop]);
                }
            }
        },

        //-------------------------------
        //  Store and restore inline CSS
        //-------------------------------
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
    //
    //  Scroll to show 
    //
    //  Usage: Add CSS Class "scrollshow"
    //  (case sensitive) to the HTML element
    //  you want to animate.
    //
    //-----------------------------------
    (function() {
        $(window).scroll(function(event) {
            var transitionTime = 600; //Transition time in millisecond
            var transTimeInSec = transitionTime / 1000; //Transition time in second

            var transition = { //CSS Class object for showing element
                "transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-webkit-transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-o-transition": "opacity " + transTimeInSec + "s ease-in-out",
                "-moz-transition": "opacity " + transTimeInSec + "s ease-in-out"
            };

            var elements = Array.from($(".scrollshow"));
            var currElem = elements.shift();

            if (currElem !== undefined) {
                let windowBottom = $(window).scrollTop() + $(window).height(),
                    curEleBottom = $(currElem).offset().top + $(currElem).height();

                if (windowBottom >= curEleBottom) {
                    let styleStr = Utility.storeInlineCSS($(currElem)); // Store the inline css style

                    Utility.addCSS($(currElem), transition);
                    $(currElem).removeClass('scrollshow');

                    setTimeout(function() { //After the animation, restore the inline style
                        Utility.restoreInlineCSS($(currElem), styleStr);
                    }, transitionTime - 1);
                }
            }
        });
    })();

    //-------------------------------------
    //
    //  Scroll to internal link
    //
    //  Usage: Add CSS Class "scrolllink"
    //  (case sensitive) to the HTML element
    //  you want to animate.
    //
    //-----------------------------------
    (function() {
        $(".scrolllink").on('click', function(event) {
            var thisHref = $(event.target).attr('href');
            if (typeof thisHref !== "undefined") { //  Check if it's on an anchor tag or with href
                if (thisHref[0] === '#') { //  Check if it's internal link
                    event.preventDefault();
                    let thisHash = this.hash;
                    let animateTime = 600;
                    $('html, body').animate({
                        scrollTop: $(thisHash).offset().top
                    }, animateTime, () => {
                        window.location.hash = thisHash;
                    });
                }
            }
        });
    })();
});

