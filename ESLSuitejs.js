/* jshint esversion: 6 */

$(document).ready(() => {
    "use strict";
    //----------------------------------
    //  Global constants
    //----------------------------------
    const NONE = "none"; //  Display none
    const OPACITY_0 = "opacity0";

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

    //---------------------------------------------------
    //
    //  Popped-out window
    //
    //  Usage: Add CSS Class 'popoverbtn'
    //  to the button that triggers popped-out window.
    //  Add CSS Class 'popovercontent' to the outermost
    //  HTML element of your content in popped-out window.
    //
    //---------------------------------------------------
    (function() {
        //-------------
        //  Constants
        //-------------
        const SHOW_PROP = "translate(-50%, -50%) scale(1)"; //  Property used to show the window
        const HIDE_PROP = "translate(-50%, -50%) scale(0)"; //  Property used to hide the window
        const ANIMATE_TIME = 400; //  Window animate time
        const MOBILE_WIDTH = 601; //  Mobile screen width
        const NO_OVERFLOW = "nooverflow"; //  No vertical scrolling
        const POP_CONT_MAX = 50; //  Max popped out window content

        //----------------------
        //  Build HTML
        //----------------------
        (function() {
            //--------------------------
            //  Build outer background
            //--------------------------
            var bg = "<div class='popoverbg none'></div>";
            $(bg).appendTo('body');

            //--------------------------
            //  Build popped-out window
            //--------------------------
            var wnd = "<div class='popoverwnd whiteback text-center'></div>";
            $(wnd).appendTo('.popoverbg');

            //---------------------------
            //  Build close button
            //---------------------------
            var closebtn = "<div class='close glyphicon glyphicon-remove'></div>";
            $(closebtn).appendTo('.popoverwnd');

            //---------------------------
            //  Append content
            //---------------------------
            $(".popovercontent").appendTo('.popoverwnd').removeClass(NONE);
        })();

        //------------------------
        //  Transform function
        //------------------------
        function transform(ele, prop) {
            if (typeof ele !== "undefined" && typeof prop !== "undefined") {
                ele.css("transform", prop);
                ele.css("-webkit-transform", prop);
                ele.css("-o-transform", prop);
                ele.css("-moz-transform", prop);
            }
        }

        //-------------------------------
        //  Popped out window jquery vars
        //-------------------------------
        var background = $('.popoverbg'),
            wnd = $('.popoverwnd'),
            close = $('.close');

        //  Currrent popped out content
        var curPopCont = null;

        //---------------------------------------------
        //  Show the window and append the content
        //---------------------------------------------
        for (let i = 1; i <= POP_CONT_MAX; i++) {
            let thisCont = "popcont" + i;
            let thisBtn = "popbtn" + i;
            $("." + thisBtn).click((event) => {
                //--------------------------
                //  Mobile compatibility
                //--------------------------
                if ($(window).width() < MOBILE_WIDTH) {
                    wnd.css("width", "100vw").css("height", "80vh");
                }

                //  Show backgournd
                background.fadeIn(ANIMATE_TIME);

                //  Show window
                transform(wnd, SHOW_PROP);

                //  Toggle scroll bar
                $('html').toggleClass(NO_OVERFLOW);

                curPopCont = $("." + thisCont);

                curPopCont.toggleClass(NONE);
            });
        }

        //--------------------------------------------------
        //  Close the window and toggle the content
        //--------------------------------------------------
        close.click(function(event) {

            //  Hide window
            transform(wnd, HIDE_PROP);

            //  Toggle scroll bar
            $("html").toggleClass(NO_OVERFLOW);

            //  Hide backgournd
            background.fadeOut(ANIMATE_TIME);

            setTimeout(function() {
                curPopCont.toggleClass(NONE);
            }, ANIMATE_TIME);
        });
    })();

    //--------------------------------------------------
    // 
    //  Auto-fade-carousel
    //
    //  Usage: Add CSS Class 'auto-fade-item' to items 
    //  that you want to make carousel. All items should
    //  have approximately the same height and width and
    //  they should be in the same HTML element such as
    //  <div> or <section>
    //--------------------------------------------------
    (function() {
        var items = $(".auto-fade-item"),
            index = 0, //  Loop index among all items
            maxHeight = 0;

        const INTERVAL_TIME = 7000, //Time period for setInterval
            TRANSITION_TIME = 400, //Time period of css transition
            AUTO_ADJUST_HEIGHT = "auto-adjust-height";


        //--------------------------------------------------------
        //  Add transition. Show the first item and hide others
        //--------------------------------------------------------
        items.addClass('transition').addClass('opacity0').addClass('none');
        $(items[index]).removeClass('none').removeClass('opacity0');

        var autoFadeCarouselInterval = setInterval(() => {
                //--------------------------------------------------------------
                //  Set the height of the wrapper to the largest item's height
                //  if specifying "auto-adjust-height"
                //--------------------------------------------------------------
                if (items.parent().hasClass(AUTO_ADJUST_HEIGHT)) {
                    let thisHeight = $(items[index]).outerHeight();
                    if (thisHeight > maxHeight) {
                        maxHeight = thisHeight;
                        items.parent().css("height", maxHeight * 1.15);
                    }
                }

                //  Fade out the current item
                $(items[index]).addClass(OPACITY_0);

                //------------------------------------
                //  Display next item after fading
                //------------------------------------
                setTimeout(() => {
                    $(items[index]).addClass(NONE);

                    //  Wrap index with items length
                    index = (index + 1) % items.length;

                    $(items[index]).removeClass(NONE);

                    setTimeout(() => {
                        $(items[index]).removeClass(OPACITY_0);
                    }, TRANSITION_TIME / 2);

                }, TRANSITION_TIME);
            },
            INTERVAL_TIME);
    })();
});

