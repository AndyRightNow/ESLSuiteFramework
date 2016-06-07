/* jshint esversion: 6 */

$(document).ready(() => {
    "use strict";
    //----------------------------------
    //  Global constants
    //----------------------------------
    const NONE = "none"; //  Display none
    const OPACITY_0 = "opacity0";
    const MOBILE_WIDTH = 601; //  Mobile screen width

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
        },

        //-------------------------------
        //  Check if it's mobile version
        //-------------------------------
        isMobile: function() {
            return $(window).width() <= MOBILE_WIDTH;
        }
    };

    //--------------------------------------------------------------------------------
    //
    //  Scroll to show 
    //
    //  Usage: Add CSS Class "scrollshow"
    //  (case sensitive) to the HTML element
    //  you want to scroll to show. When the bottom
    //  of the window goes past the bottom (middle line in mobile) of the element
    //  , the element will show in effect specified.
    //
    //  Effect: The default effect is fadeing in without specific direction. 
    //          Effects available: "scrollshow-fadefrombottom"
    //                             "scrollshow-scalein"
    //  Note: 1. You can not use effects without adding "scrollshow"
    //        2. You can only use one effect class at a time.
    //--------------------------------------------------------------------------------
    (function() {
        const FADE_FROM_BOTTOM = "scrollshow-fadefrombottom";
        const SCALE_IN = "scrollshow-scalein";
        const SCROLL_SHOW = 'scrollshow';

        const TRANSITION_TIME = 600; //Transition time in millisecond
        const TRANSITION_TIME_IN_SEC = TRANSITION_TIME / 1000; //Transition time in second

        const TRANSITION_OBJECT = { //CSS Class object for showing element
            "transition": "all " + TRANSITION_TIME_IN_SEC + "s ease-in-out",
            "-webkit-transition": "all " + TRANSITION_TIME_IN_SEC + "s ease-in-out",
            "-o-transition": "all " + TRANSITION_TIME_IN_SEC + "s ease-in-out",
            "-moz-transition": "all " + TRANSITION_TIME_IN_SEC + "s ease-in-out"
        };

        $(window).scroll(function(event) {

            var elements = Array.from($("." + SCROLL_SHOW));
            var currElem = elements.shift();

            if (currElem !== undefined) {
                let windowBottom = $(window).scrollTop() + $(window).height(),
                    curEleBottom = $(currElem).offset().top + $(currElem).height();

                if (windowBottom >= curEleBottom) {
                    let styleStr = Utility.storeInlineCSS($(currElem)); // Store the inline css style

                    Utility.addCSS($(currElem), TRANSITION_OBJECT); //Add css transition to elements

                    $(currElem).removeClass(SCROLL_SHOW); //Show default effect

                    //------------------
                    //  Switch effects
                    //------------------
                    if ($(currElem).hasClass(FADE_FROM_BOTTOM)) {
                        $(currElem).removeClass(FADE_FROM_BOTTOM);
                    } else if ($(currElem).hasClass(SCALE_IN)) {
                        $(currElem).removeClass(SCALE_IN);
                    }


                    setTimeout(function() { //After the animation, restore the inline style
                        Utility.restoreInlineCSS($(currElem), styleStr);
                    }, TRANSITION_TIME - 1);
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
    //  Add CSS class "popcont1" to "popcont50" and "popbtn1" to "popobtn50"
    //  respectively to the corresponding contents and buttons.
    //  
    //  Add CSS Class "popbtn-nomobile" to the button you want to disable
    //  pop over window on mobile.
    //
    //---------------------------------------------------
    (function() {
        //-------------
        //  Constants
        //-------------
        const SHOW_PROP = "translate(-50%, -50%) scale(1)"; //  Property used to show the window
        const HIDE_PROP = "translate(-50%, -50%) scale(0)"; //  Property used to hide the window
        const ANIMATE_TIME = 400; //  Window animate time
        const NO_OVERFLOW = "nooverflow"; //  No vertical scrolling
        const POP_CONT_MAX = 50; //  Max popped out window content
        const NO_MOBILE = "popbtn-nomobile";

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

            //  Hide all the content
            $("." + thisCont).addClass(NONE);

            $("." + thisBtn).click((event) => {
                //---------------------------------------------------
                //  Adjust the size of the pop over window on mobile
                //---------------------------------------------------
                if (Utility.isMobile()) {
                    wnd.css("width", "100vw").css("height", "80vh");
                }

                //------------------------------------------------------------
                //  Prevent default action and show the window when
                //  1. Not on mobile
                //  2. On mobile and "popbtn-nomobile" not specified for the button
                //------------------------------------------------------------
                if (!Utility.isMobile() ||
                    Utility.isMobile() && !$("." + thisBtn).hasClass(NO_MOBILE)) {
                    event.preventDefault();

                    //  Show backgournd
                    background.fadeIn(ANIMATE_TIME);

                    //  Show window
                    transform(wnd, SHOW_PROP);

                    //  Toggle scroll bar
                    $('html').toggleClass(NO_OVERFLOW);

                    curPopCont = $("." + thisCont);

                    curPopCont.toggleClass(NONE);
                }
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
    //  Show hidden elements
    //
    //  Usage: Add CSS class 'hiddenitem' to elements you
    //  want to hide and show on button click. Add CSS class
    //  "showhiddenitembtn" to the button you want to bind. Specify how
    //  many items you want to show on one click by adding
    //  attribute name "numtoshow" and value to the button element.
    //  Value can be any number ,"All", "Half", or "Quarter". The default value is "All".
    //  E.g. numtoshow = "All"
    //       numtoshow = "1"
    //
    //  Note: After all elements are shown, the button will be hidden
    //--------------------------------------------------
    (function() {
        //-------------------------
        //  Constants
        //-------------------------
        const ALL = "All",
            HALF = "Half",
            QUARTER = "Quarter";
        const NUM_TO_SHOW = "numtoshow";
        const HIDDEN_ITEM = "hiddenitem";

        var hiddenElements = $("." + HIDDEN_ITEM);
        var showBtn = $(".showhiddenitembtn");
        var numToShow = ALL;

        //------------------------------------
        //  Get user specified number to show
        //------------------------------------
        var specifiedNumToShow = showBtn.attr(NUM_TO_SHOW);
        if (typeof specifiedNumToShow !== "undefined") {
            let thisNum = parseInt(specifiedNumToShow);
            if (!isNaN(thisNum)) {
                numToShow = thisNum;
            } else {
                switch (specifiedNumToShow) {
                    case HALF:
                        numToShow = hiddenElements.length / 2;
                        break;
                    case QUARTER:
                        numToShow = hiddenElements.length / 4;
                        break;
                }
            }
        }

        showBtn.click((event) => {
            if (hiddenElements.length > 0) {
                if (numToShow === ALL || hiddenElements.length <= numToShow) {
                    hiddenElements.removeClass(HIDDEN_ITEM);
                    showBtn.addClass(NONE);
                } else {
                    for (let i = 0; i < numToShow; i++) {
                        $(hiddenElements[i]).removeClass(HIDDEN_ITEM);
                    }
                }
            }
            hiddenElements = $("." + HIDDEN_ITEM);
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

        if (items.length > 0) {
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
        }
    })();

    //--------------------------------------------------
    // 
    //  Responsive element height
    //
    //  Usage: Add attribute to a HTML element: 
    //  1. adaptheight = "Sibling-n" means setting the height
    //  of the element to the height of its nth sibling
    //  e.g. "Sibling-1" 
    //
    //  
    //--------------------------------------------------
    (function() {
        //------------------------
        //  Adapt height targets
        //------------------------
        const SIBLING = "Sibling";

        var ResponsiveElementHeightInterval = setInterval(() => {
            let elements = $("[adaptheight]");
            if (typeof elements === "undefined") {  //  Check if elements with the attribute don't exist
                clearInterval(ResponsiveElementHeightInterval);
            }

            let isAllInvalid = true;    //  Flag used to check if there is at least one valid attribute value
            for (let i = 0; i < elements.length; i++) { //  Use native for loop to make the loop within this scope
                let thisAttr = $(elements[i]).attr('adaptheight');
                if (typeof thisAttr !== "undefined") {
                    if (thisAttr.substr(0, SIBLING.length) === SIBLING) { 
                        let num = parseInt(thisAttr[thisAttr.length - 1]);
                        if (!isNaN(num)) {
                            let thisSibling = $(elements[i]).siblings()[num - 1];
                            if (typeof thisSibling !== "undefined") {
                                isAllInvalid = false;
                                $(elements[i]).css("height", $(thisSibling).height());
                            }
                        }
                    }
                }
            }
            if (isAllInvalid) {
                clearInterval(ResponsiveElementHeightInterval);
            }
        });
    })();
});

