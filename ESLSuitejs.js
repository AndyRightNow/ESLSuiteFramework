/* jshint esversion: 6 */
"use strict";

//////////////////////////////////////////////////////////////////////
//                        ESL Suite Framework JS
//      
//        The framework encapsulate animation effects and widgets, 
//        all of which are in a certain CSS style.
//
//
//////////////////////////////////////////////////////////////////////
/////                                                              ///
/////    All APIs under namespace ESLSuite should be used inside   ///
/////    a "$(document).ready()" function or it's not going to     ///
/////    work properly.                                            ///
/////                                                              ///
//////////////////////////////////////////////////////////////////////

//  ESLSuite namespace
var ESLSuite = {
    //----------------------------------
    //  Global constants
    //----------------------------------
    NONE: "none", //  Display none
    OPACITY_0: "opacity0",
    MOBILE_WIDTH: 601, //  Mobile screen width
    TABLET_WIDTH: 992,
    Util: {
        //---------------------------------------
        //  Add CSS Class object to the DOM
        //---------------------------------------
        addCSS: function (jqueryObject, classObject) {
            if (typeof jqueryObject !== "undefined" && typeof classObject !== "undefined") {
                for (let prop in classObject) {
                    jqueryObject.css(prop, classObject[prop]);
                }
            }
        },

        //-------------------------------
        //  Check if it's mobile version
        //-------------------------------
        isMobile: function () {
            return $(window).width() <= ESLSuite.MOBILE_WIDTH;
        },

        //---------------------------------------------
        //  Check if a number is within certain range
        //---------------------------------------------
        isInRange: function (number, rangeLow, rangeHigh) {
            return number >= rangeLow && number <= rangeHigh;
        },

        //--------------------------------------------------------------------
        //  Get a attribute value of a HTML element and convert it to a number
        //--------------------------------------------------------------------
        getAttrAsNumber: function (jqueryObject, attrName) {
            if (typeof jqueryObject !== "undefined") {
                if (typeof attrName === "string") {
                    return parseFloat(jqueryObject.attr(attrName));
                }
            }
            return NaN;
        },

        //------------------------------------------
        //  Get CSS property value as number
        //------------------------------------------
        getCSSAsNumber: function (jqueryObject, propertyName) {
            if (typeof jqueryObject !== "undefined") {
                if (typeof propertyName === "string") {
                    return parseFloat(jqueryObject.css(propertyName));
                }
            }
            return NaN;
        },

        //----------------------------------------------
        //  Clamp a value within a certain range
        //----------------------------------------------
        clamp: function (value, low, high) {
            return value < low ? low : value > high ? high : value;
        },

        //----------------------------------------------
        //  Get numbers from a string. 
        //
        //  Return: null if nothing is found, or an array of
        //          numbers if anything is found.
        //----------------------------------------------
        getNumbersFromString: function (str) {
            if (typeof str !== "undefined") {
                var regEx = /\d+/;

                var matched = str.match(regEx);

                if (matched !== null) {
                    for (let i = 0; i < matched.length; i++) {
                        matched[i] = parseFloat(matched[i]);
                    }
                }

                return matched;
            }
        },

        //----------------------------------------
        //  Get the properties count of an object
        //
        //  Note: It doesn't count all properties on
        //        its prototype chain for the sake of 
        //        efficiency.
        //
        //  Return: Count of the properties
        //----------------------------------------
        getPropertyCount: function (obj) {
            var cnt = 0;
            for (let prop in obj) {
                cnt++;
            }
            return cnt;
        }
    }
};

//---------------------------------------------------
//  Public APIs
//
//  Used to be called in user's code to interact with
//  the code inside the anonymous function scope
//----------------------------------------------------
var ESLSuiteAPI = {
    //-------------------------------------
    //  APIs of Pop-out window widget
    //-------------------------------------
    PopOutWindow: {
        //  Private member variable that indicates the rebind signal
        _rebindState: false,
        //-----------------------------------------------------------------
        //  Private member function that changes the rebind signal
        //---------------------------------------------------------------
        _changeRebindState: function (state) {
            ESLSuiteAPI.PopOutWindow._rebindState = state;
        },

        //----------------------------------------------------------------------
        //  Public member function that sends rebind signal to the widget code
        //----------------------------------------------------------------------
        rebindElements: function () {
            ESLSuiteAPI.PopOutWindow._changeRebindState(true);
        }
    }
};

//----------------------------
//  Utility namespace
//----------------------------

$(document).ready(() => {

    //--------------------------------------------------------------------------------
    //
    //  Scroll to show elements
    //
    //  Usage: 
    //  
    //  Add CSS Class "scroll-show"
    //  (case sensitive) to the HTML element
    //  you want to scroll to show. When the bottom
    //  of the window goes past the bottom (middle line in mobile) of the element
    //  , the element will show in the effect specified.
    //
    //  Effect: The default effect is fadeing in without specific direction. 
    //          Effects available: "scroll-show-fade-from-bottom"
    //                             "scroll-show-scale-in"
    //  Note: 1. You can not use effects without adding "scroll-show"
    //        2. You can only use one effect class at a time.
    //--------------------------------------------------------------------------------
    (function () {
        const FADE_FROM_BOTTOM = "scroll-show-fade-from-bottom",
            SCALE_IN = "scroll-show-scale-in",
            SCROLL_SHOW = 'scroll-show',
            TRANSITION_600MS = "transition-600ms",
            TRANSITION_TIME = 600; //Transition time in millisecond


        var isCurrentElementShown = false, //  Flag used to indicate if current element is shown
            canGetNextElement = true, //  Flag used to indicate if the next element can be fetched
            currElem, //  Current element to show
            removeTransitionQueue = []; //  A queue used to store the actions of removing transitions

        //  Add transitions to all scroll-show elements
        $("." + SCROLL_SHOW).addClass(TRANSITION_600MS);

        var ScrollToShowEventLoop = setInterval(() => {
            //--------------------------------------
            //  Get the collection of elements with
            //  class "scroll-show" and check if the collection's
            //  length equals to zero or the collection is 
            //  undefined, clear the interval.
            //--------------------------------------
            var elements = Array.from($("." + SCROLL_SHOW));
            if (!elements ||
                typeof elements === "undefined" ||
                elements.length === 0) {
                clearInterval(ScrollToShowEventLoop);
            }

            //-------------------------------------
            //  If the current element is shown and
            //  the next element can be fetched, 
            //  fetch the next element and reset flags
            //-------------------------------------
            if (canGetNextElement) {
                currElem = elements.shift();
                isCurrentElementShown = false;
                canGetNextElement = false;
            }

            if (!isCurrentElementShown) {
                if (typeof currElem !== "undefined") {
                    //--------------------------------------------
                    //  Get the bottom positions of the window and
                    //  the current element
                    //--------------------------------------------
                    let windowBottom = $(window).scrollTop() + $(window).height(),
                        curEleBottom = $(currElem).offset().top + $(currElem).height();

                    //If the bottom of the window goes under the bottom of the element
                    if (windowBottom >= curEleBottom) {

                        //Show default effect
                        $(currElem).removeClass(SCROLL_SHOW);

                        //------------------
                        //  Switch effects
                        //------------------
                        if ($(currElem).hasClass(FADE_FROM_BOTTOM)) {
                            $(currElem).removeClass(FADE_FROM_BOTTOM);
                        } else if ($(currElem).hasClass(SCALE_IN)) {
                            $(currElem).removeClass(SCALE_IN);
                        }

                        //  Push into queue
                        removeTransitionQueue.push(currElem);

                        //-----------------------------------------------
                        //  After the animation, remove the transition
                        //  and set the flag to signal that the next element 
                        //  can be fetched.
                        //-----------------------------------------------
                        setTimeout(function () {
                            if (removeTransitionQueue.length > 0) {
                                let topEle = removeTransitionQueue[0];
                                //  Check if the element is shown
                                if (!$(topEle).hasClass(SCROLL_SHOW)) {
                                    $(topEle).removeClass(TRANSITION_600MS);
                                    removeTransitionQueue.shift();
                                }
                            }
                        }, TRANSITION_TIME);
                        canGetNextElement = true;
                        isCurrentElementShown = true;
                    }
                }
            }
        });
    })();

    //-------------------------------------
    //
    //  Scroll to internal link
    //
    //  Usage: 
    //  
    //  Add CSS Class "scroll-link"
    //  (case sensitive) to the HTML element
    //  you want to animate.
    //
    //-----------------------------------
    (function () {
        const ANIMATE_TIME = 600;

        $(".scroll-link").on('click', function (event) {
            var thisHref = $(event.target).attr('href');
            if (typeof thisHref !== "undefined") { //  Check if it's in an anchor tag or with href
                if (thisHref[0] === '#') { //  Check if it's internal link
                    event.preventDefault();

                    //  Store the internal link address
                    let thisHash = this.hash;

                    $('html, body').animate({
                        scrollTop: $(thisHash).offset().top
                    }, ANIMATE_TIME, () => {
                        //  Jump to the address
                        window.location.hash = thisHash;
                    });
                }
            }
        });
    })();

    //---------------------------------------------------
    //
    //  Popped-over window
    //
    //  Usage: 
    //  
    //  Add CSS Class 'popovercontent' to the outermost
    //  HTML element of your content in popped-over window.
    //  Add CSS class "popcont1" to "popcont50" and "popbtn1" to "popobtn50"
    //  respectively to the corresponding contents and buttons.
    //  
    //  Add CSS Class "popbtn-nomobile" to the button you want to disable
    //  pop over window on mobile.
    //
    //---------------------------------------------------
    (function () {
        //-------------
        //  Constants
        //-------------
        const SHOW_PROP = "translate(-50%, -50%) scale(1)", //  Property used to show the window
            HIDE_PROP = "translate(-50%, -50%) scale(0)", //  Property used to hide the window
            ANIMATE_TIME = 400, //  Window animate time
            NO_OVERFLOW = "nooverflow", //  No vertical scrolling
            POP_CONT_MAX = 50, //  Max popped over window content
            POP_BUTTON_NO_MOBILE = "popbtn-nomobile",
            MOBILE_WINDOW_WIDTH = "100vw",
            MOBILE_WINDOW_HEIGHT = "80vh",
            POP_OVER_BACKGROUND = "popoverbg",
            POP_OVER_WINDOW = "popoverwnd",
            POP_OVER_CONTENT = "popovercontent",
            POP_BTN = "popbtn",
            POP_CONT = "popcont";

        //----------------------
        //  Build HTML
        //----------------------
        (function () {
            //--------------------------
            //  Build outer background
            //--------------------------
            var bg = "<div class='" + POP_OVER_BACKGROUND + " " + ESLSuite.NONE + "'></div>";
            $(bg).appendTo('body');

            //--------------------------
            //  Build popped-over window
            //--------------------------
            var wnd = "<div class='" + POP_OVER_WINDOW + " whiteback text-center'></div>";
            $(wnd).appendTo("." + POP_OVER_BACKGROUND);

            //---------------------------
            //  Build close button
            //---------------------------
            var closebtn = "<div class='close glyphicon glyphicon-remove'></div>";
            $(closebtn).appendTo("." + POP_OVER_WINDOW);

            //---------------------------
            //  Append content
            //---------------------------
            $("." + POP_OVER_CONTENT).appendTo("." + POP_OVER_WINDOW).removeClass(ESLSuite.NONE);
        })();

        //-------------------------------
        //  Popped over window jquery vars
        //-------------------------------
        var background = $("." + POP_OVER_BACKGROUND),
            wnd = $("." + POP_OVER_WINDOW),
            close = $('.close');

        //  Currrent popped over content
        var curPopCont = null;

        //------------------------
        //  Transform function
        //  @param jqueryObject: DOM element selected by jquery function '$'
        //  @param propValue: CSS property value. 
        //------------------------
        function transform(jqueryObject, propValue) {
            if (typeof jqueryObject !== "undefined" &&
                typeof propValue !== "undefined") {
                jqueryObject.css("transform", propValue);
                jqueryObject.css("-webkit-transform", propValue);
                jqueryObject.css("-o-transform", propValue);
                jqueryObject.css("-moz-transform", propValue);
            }
        }

        //---------------------------------------------------------
        //  Bind popbtn click events. It returns the button count
        //---------------------------------------------------------
        function bindButtonClickEvents() {
            for (let i = 1; i <= POP_CONT_MAX; i++) {
                //-----------------------------------------
                //  Get the popbtn and popcont class name
                //-----------------------------------------
                let thisCont = POP_CONT + i,
                    thisBtn = POP_BTN + i,
                    thisBtnElements = $("." + thisBtn);

                if (typeof thisBtnElements !== "undefined" &&
                    thisBtnElements.length > 0) {
                    for (let j = 0; j < thisBtnElements.length; j++) {
                        $(thisBtnElements[j]).click((event) => {
                            //---------------------------------------------------
                            //  Adjust the size of the pop over window on mobile
                            //---------------------------------------------------
                            if (ESLSuite.Util.isMobile()) {
                                wnd.css("width", MOBILE_WINDOW_WIDTH);
                            }

                            //------------------------------------------------------------
                            //  Prevent default action and show the window when
                            //  1. Not on mobile
                            //  2. On mobile and "popbtn-nomobile" not specified for the button
                            //------------------------------------------------------------
                            if (!ESLSuite.Util.isMobile() ||
                                (ESLSuite.Util.isMobile() && !$("." + thisBtn).hasClass(POP_BUTTON_NO_MOBILE))) {
                                event.preventDefault();

                                //  Show backgournd
                                background.fadeIn(ANIMATE_TIME);

                                //  Show window
                                transform(wnd, SHOW_PROP);

                                //  Toggle scroll bar
                                $('html').toggleClass(NO_OVERFLOW);

                                //  Store the current popout content
                                curPopCont = $("." + thisCont);

                                //  Show the content
                                curPopCont.removeClass(ESLSuite.NONE);
                            }
                        });
                    }
                }
            }
        }

        //---------------------------------------------
        //  Clear popbtn(s) click events
        //---------------------------------------------
        function clearButtonClickEvents() {
            for (let i = 1; i <= POP_CONT_MAX; i++) {
                let thisBtn = "." + POP_BTN + i;
                $(thisBtn).off("click");
            }
        }

        //-----------------------------
        //  Hide all the content
        //-----------------------------
        for (let i = 1; i <= POP_CONT_MAX; i++) {
            let thisContClass = "." + POP_CONT + i;
            if (!$(thisContClass).hasClass(ESLSuite.NONE)) {
                $(thisContClass).addClass(ESLSuite.NONE);
            }
        }

        //----------------------------------------------
        //  Bind click events to all buttons, including 
        //  buttons that are added dynamically.
        //
        //  ******************************************
        //  *******************NOTE*******************
        //  ******************************************
        //  This is a dirty hack which I used as a temporary
        //  trick to handle all dynamically added elements.
        //----------------------------------------------
        setTimeout(() => {
            bindButtonClickEvents();
        });

        //----------------------------------------------
        //  Event loop to get the API signals
        //----------------------------------------------
        var ESLSuiteAPI_PopOutWindow_EventLoop = setInterval(() => {
            //----------------------------------
            //  Check rebind signal
            //----------------------------------
            if (ESLSuiteAPI.PopOutWindow._rebindState) {
                clearButtonClickEvents();
                bindButtonClickEvents();
                //  Reset rebind state
                ESLSuiteAPI.PopOutWindow._changeRebindState(false);
            }
        });

        //--------------------------------------------------
        //  Close the window and toggle the content
        //--------------------------------------------------
        close.click(function (event) {

            //  Hide window
            transform(wnd, HIDE_PROP);

            //  Toggle scroll bar
            $("html").toggleClass(NO_OVERFLOW);

            //  Hide backgournd
            background.fadeOut(ANIMATE_TIME);

            setTimeout(function () {
                curPopCont.toggleClass(ESLSuite.NONE);
            }, ANIMATE_TIME);
        });
    })();

    //--------------------------------------------------
    //
    //  Show hidden elements
    //
    //  Usage: 
    //  
    //  Add CSS class 'hiddenitem' to elements you
    //  want to hide and show on button click. Add CSS class
    //  "showhiddenitembtn" to the button you want to bind. Specify how
    //  many items you want to show on one click by adding
    //  attribute name "num-to-show" and value to the button element.
    //  Value can be any integer number ,"All", "Half", or "Quarter". 
    //  The default value is "All".
    //  E.g. num-to-show = "All"
    //       num-to-show = "Half"
    //       num-to-show = "1"
    //
    //  Note: After all elements are shown, the button will be hidden
    //--------------------------------------------------
    (function () {
        //-------------------------
        //  Constants
        //-------------------------
        const ALL = "All",
            HALF = "Half",
            QUARTER = "Quarter",
            NUM_TO_SHOW = "num-to-show",
            HIDDEN_ITEM = "hiddenitem";

        var hiddenItems = $("." + HIDDEN_ITEM),
            showBtn = $(".showhiddenitembtn"), //  Button to click to show
            numToShow = ALL; //  How many element to show on one click

        //------------------------------------
        //  Get user specified number to show
        //------------------------------------
        var specifiedNumToShow = showBtn.attr(NUM_TO_SHOW);
        if (typeof specifiedNumToShow !== "undefined") { //  If the attribute exists
            //-----------------------------------
            //  Check if the user input a number
            //-----------------------------------
            let thisNum = parseInt(specifiedNumToShow);
            if (!isNaN(thisNum)) {
                numToShow = thisNum;
            } else {
                //-----------------------------------------------
                //  Else check if the input is valid string value
                //------------------- ----------------------------
                switch (specifiedNumToShow) {
                    case HALF:
                        numToShow = hiddenItems.length / 2;
                        break;
                    case QUARTER:
                        numToShow = hiddenItems.length / 4;
                        break;
                }
            }
        }

        showBtn.click((event) => {
            //-----------------------------------------------
            //  Check if there is still any hidden element 
            //-----------------------------------------------
            if (hiddenItems.length > 0) {
                //--------------------------------------------
                //  If the number to show is larger than 
                //  the current hidden elements count or
                //  the ALL macro is specified
                //--------------------------------------------
                if (numToShow === ALL ||
                    hiddenItems.length <= numToShow) {
                    hiddenItems.removeClass(HIDDEN_ITEM);
                    showBtn.addClass(ESLSuite.NONE);
                }
                //---------------------------
                //  Eles show the elements based
                //  on the number to show
                //---------------------------
                else {
                    for (let i = 0; i < numToShow; i++) {
                        $(hiddenItems[i]).removeClass(HIDDEN_ITEM);
                    }
                }
            }
            //  Update the hidden elements collection
            hiddenItems = $("." + HIDDEN_ITEM);
        });
    })();

    //--------------------------------------------------
    // 
    //  Auto-fade-carousel
    //
    //  Usage: 
    //  
    //  Add CSS Class 'auto-fade-item' to items 
    //  that you want to make carousel. All items should
    //  have approximately the same height and width and
    //  they should be in the same HTML element such as
    //  <div> or <section>. Add CSS class "auto-adjust-height" to
    //  the wrapper of items can adjust the height of the wrapper 
    //  to the largest element of the items.
    //--------------------------------------------------
    (function () {
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
            items.addClass('transition').addClass(ESLSuite.OPACITY_0).addClass(ESLSuite.NONE);
            $(items[index]).removeClass(ESLSuite.NONE).removeClass(ESLSuite.OPACITY_0);

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
                    $(items[index]).addClass(ESLSuite.OPACITY_0);

                    //------------------------------------
                    //  Display next item after fading
                    //------------------------------------
                    setTimeout(() => {
                        $(items[index]).addClass(ESLSuite.NONE);

                        //  Wrap index with items length
                        index = (index + 1) % items.length;

                        $(items[index]).removeClass(ESLSuite.NONE);

                        setTimeout(() => {
                            $(items[index]).removeClass(ESLSuite.OPACITY_0);
                        }, TRANSITION_TIME / 2);

                    }, TRANSITION_TIME);
                },
                INTERVAL_TIME);
        }
    })();

    //--------------------------------------------------
    // 
    //  Responsive element properties
    //
    //  Usage: 
    //  
    //  Add attribute to a HTML element: 
    //  1. adapt-height = "Sibling-n" means setting the height
    //  of the element to the height of its nth sibling
    //  e.g. "Sibling-1" (n starts from 1)
    //
    //  2. adapt-outer-height = "Sibling-n" means setting the height
    //  of the element to the outer height of its nth sibling
    //  e.g. "Sibling-1" (n starts from 1)
    //--------------------------------------------------
    (function () {
        //------------------------
        //  Adapt height targets
        //------------------------
        const SIBLING = "Sibling",
            ADAPT_OUTER_HEIGHT = "adapt-outer-height",
            ADAPT_HEIGHT = "adapt-height",
            ATTR_VALUE_REGEX = /^Sibling-\d+$/; //  Match the whole string with "Sibling-n"

        var adaptHeightElements = $("[" + ADAPT_HEIGHT + "]"),
            adaptOuterHeightElements = $("[" + ADAPT_OUTER_HEIGHT + "]");

        //---------------------------------------------
        //  Function used to perform height adjustment
        //  @param elements: HTML elements with "adapt-height" or 
        //                   "adapt-outer-height" attribute.
        //  @param isOuter:  Check if the current elements to process has
        //                   "adapt-outer-height" or "adapt-height"
        //---------------------------------------------
        function adjustHeight(elements, isOuter) {
            var val;
            for (var i = 0, ll = elements.length; i < ll; i++) {
                val = elements[i];
                //  Fetch the attribute value depending on isOuter
                let attrVal = $(val).attr(isOuter ?
                    ADAPT_OUTER_HEIGHT : ADAPT_HEIGHT);
                //  Check if the attribute value is an exact match of the pattern
                let matchRes = attrVal.match(ATTR_VALUE_REGEX);

                if (matchRes !== null) {
                    attrVal = matchRes[0];
                    //  Get the number given by users and subtract 1 from it to make it an index
                    let siblingIndex = ESLSuite.Util.getNumbersFromString(attrVal)[0] - 1;

                    let thisSibling = $(val).siblings()[siblingIndex];
                    if (typeof thisSibling !== "undefined" &&
                        thisSibling.length !== 0) {
                        let thisHeight = isOuter ?
                            $(thisSibling).outerHeight() : $(thisSibling).height();
                        $(val).height(thisHeight);
                    }
                }
            }
        }

        //-------------------------------------------------------------------
        //  Use an interval to adapt height to dynamically resized siblings
        //------------------------------------------------------------------
        var adaptHeightInterval = setInterval(() => {
            //  Flag to check if there is no either "adapt-height" or "adapt-outer-height"
            //  is specified
            let isAllInvalid = true;

            if (typeof adaptHeightElements !== "undefined" &&
                adaptHeightElements.length !== 0) {
                isAllInvalid = false;
                adjustHeight(adaptHeightElements, false);
            }

            if (typeof adaptOuterHeightElements !== "undefined" &&
                adaptOuterHeightElements.length !== 0) {
                isAllInvalid = false;
                adjustHeight(adaptOuterHeightElements, true);
            }

            if (isAllInvalid) {
                clearInterval(adaptHeightInterval);
            }
        });

    })();

    //--------------------------------------------------
    // 
    //  UTC Count Down Timer
    //
    //  Usage: 
    //  
    //  Add CSS class "count-down" to the outer wrapper
    //  of the count down time elements.Add CSS class "count-down-year", 
    //  "count-down-month", "count-down-day", "count-down-hour", "count-down-minute" or 
    //  "count-down-second" to the corresponding HTML element to
    //  show the count down time. 
    //
    //  Set attribute value "count-down-start = 'Mon DD, YYYY'"", 
    //  "count-down-end = 'Mon DD, YYYY'"(e.g. "Dec 25, 1995"),
    //  "timezone = '+/-n'" and "count-down-state = 'On/Off'" of the 
    //  element with "count-down" class to control the count down. 
    //  The last two parameters are optional, and if not set, 
    //  they will be "+0" and "On" by default.
    //  
    //--------------------------------------------------
    (function () {
        //-------------------------------------------
        //  Count down display class names constants
        //-------------------------------------------
        const COUNT_DOWN_YEAR = "count-down-year",
            COUNT_DOWN_MONTH = "count-down-month",
            COUNT_DOWN_DAY = "count-down-day",
            COUNT_DOWN_HOUR = "count-down-hour",
            COUNT_DOWN_MINUTE = "count-down-minute",
            COUNT_DOWN_SECOND = "count-down-second",
            COUNT_DOWN_YEAR_CLASS = ".count-down-year",
            COUNT_DOWN_MONTH_CLASS = ".count-down-month",
            COUNT_DOWN_DAY_CLASS = ".count-down-day",
            COUNT_DOWN_HOUR_CLASS = ".count-down-hour",
            COUNT_DOWN_MINUTE_CLASS = ".count-down-minute",
            COUNT_DOWN_SECOND_CLASS = ".count-down-second",

            COUNT_DOWN_STATE_ATTR = "count-down-state",
            COUNT_DOWN_START_ATTR = "count-down-start",
            COUNT_DOWN_END_ATTR = "count-down-end",
            TIME_ZONE_ATTR = "time-zone",

            COUNT_DOWN_WRAPPER_CLASS = ".count-down";

        //---------------------------------
        //  Conversion constants
        //---------------------------------
        const YEAR_SEC = 31536000,
            MONTH_SEC = 2592000,
            DAY_SEC = 86400,
            HOUR_SEC = 3600,
            MIN_SEC = 60;

        //---------------------------------------------------------------------------
        //  UTC date variables and a helper function used to get current UTC date
        //---------------------------------------------------------------------------
        var date, UTCYear, UTCMonth, UTCDate, UTCHour, UTCMin, UTCSec, UTCTimeInMillisec;

        function getCurrentUTCTime() {
            date = new Date();
            UTCYear = date.getUTCFullYear();
            UTCMonth = date.getUTCMonth();
            UTCDate = date.getUTCDate();
            UTCHour = date.getUTCHours();
            UTCMin = date.getUTCMinutes();
            UTCSec = date.getUTCSeconds();
            UTCTimeInMillisec = Date.UTC(
                UTCYear,
                UTCMonth,
                UTCDate,
                UTCHour,
                UTCMin,
                UTCSec);
        }

        //-----------------------------------------------------------------
        //  Helper function to convert seconds to different parts of time
        //  Return: an object with 6 members: year, month, day, hour, min, sec 
        //-----------------------------------------------------------------
        function formatTimeFromSeconds(time) {
            var y = parseInt(time / YEAR_SEC);
            time -= (y * YEAR_SEC);

            var mo = parseInt(time / MONTH_SEC);
            time -= (mo * MONTH_SEC);

            var d = parseInt(time / DAY_SEC);
            time -= (d * DAY_SEC);

            var h = parseInt(time / HOUR_SEC);
            time -= (h * HOUR_SEC);

            var m = parseInt(time / MIN_SEC);
            time -= (m * MIN_SEC);

            var s = time;

            return {
                year: y,
                month: mo,
                day: d,
                hour: h,
                minute: m,
                second: s
            };
        }

        var countDownWrapper = $(COUNT_DOWN_WRAPPER_CLASS); //  Wrapper class

        if (typeof countDownWrapper !== "undefined" &&
            countDownWrapper.length !== 0) {

            //-----------------------------------
            //  Init all timer display elements
            //-----------------------------------
            $(COUNT_DOWN_YEAR_CLASS).text("0");
            $(COUNT_DOWN_MONTH_CLASS).text("0");
            $(COUNT_DOWN_DAY_CLASS).text("0");
            $(COUNT_DOWN_HOUR_CLASS).text("0");
            $(COUNT_DOWN_MINUTE_CLASS).text("0");
            $(COUNT_DOWN_SECOND_CLASS).text("0");

            //--------------------------------------------------
            //  Count down start and end dates in milliseconds
            //--------------------------------------------------
            let countDownStart = Date.parse(countDownWrapper.attr(COUNT_DOWN_START_ATTR));
            let countDownEnd = Date.parse(countDownWrapper.attr(COUNT_DOWN_END_ATTR));

            if (!isNaN(countDownStart) &&
                !isNaN(countDownEnd)) {

                //-----------------------------------------------
                //  Get time zone information specified by user
                //  If unspecified or invalid, set time zone to 0
                //-----------------------------------------------
                let timeZone = ESLSuite.Util.getAttrAsNumber(TIME_ZONE_ATTR);
                if (!isNaN(timeZone)) {
                    if (timeZone > 12 || timeZone < -12) {
                        timeZone = 0;
                    }
                } else {
                    timeZone = 0;
                }

                //------------------------------------------
                //  Get count down state specified by user
                //  If unpecified or invalid, set state to on
                //
                //  Use countDownState first to store the attribute
                //  specified by the user, then assign a boolean value
                //  based on the attribute to it.
                //------------------------------------------
                let countDownState = countDownWrapper.attr(COUNT_DOWN_STATE_ATTR);
                countDownState =
                    typeof countDownState === "undefined" ||
                    (countDownState !== "On" && countDownState !== "Off") ?
                    false : countDownState === "On" ? true : false;

                getCurrentUTCTime();
                if (UTCTimeInMillisec < countDownStart ||
                    UTCTimeInMillisec > countDownEnd) {
                    countDownState = false;
                }
                countDownWrapper.attr(COUNT_DOWN_STATE_ATTR, countDownState ? "On" : "Off");

                //-------------------------------------
                //  Start and show the count down if the
                //  state is true.
                //-------------------------------------
                if (countDownState) {
                    var CountDownTimerInterval = setInterval(() => {
                        //  Side effect function to update current stored UTC time
                        getCurrentUTCTime();

                        //  Time period between current time and end time in seconds
                        var timeDifPeroidInSec = (countDownEnd - UTCTimeInMillisec) / 1000;

                        //  Extract years, months, days, minutes and seconds from the seconds period
                        var extractedTime = formatTimeFromSeconds(timeDifPeroidInSec);

                        //--------------------------------------
                        //  Show the time
                        //--------------------------------------
                        $(COUNT_DOWN_YEAR_CLASS).text(extractedTime.year);
                        $(COUNT_DOWN_MONTH_CLASS).text(extractedTime.month);
                        $(COUNT_DOWN_DAY_CLASS).text(extractedTime.day);
                        $(COUNT_DOWN_HOUR_CLASS).text(extractedTime.hour);
                        $(COUNT_DOWN_MINUTE_CLASS).text(extractedTime.minute);
                        $(COUNT_DOWN_SECOND_CLASS).text(extractedTime.second);
                    }, 999);
                }
            }
        }
    })();

    //--------------------------------------------------
    // 
    //  Scrolling Carousel
    //
    //  Usage: 
    //  
    //  Add CSS class "scroll-carousel" to the 
    //  wrapper of carousel items and add "scroll-carousel-item" to the 
    //  items of carousel. Items should all have the same width
    //  and height. 
    //
    //  Add CSS class "carousel-control-left" and "carousel-control-right"
    //  to elements you want to use as left and right control for the 
    //  carousel. It will shift to left/right for 1 element for every click.
    //
    //  Set attribute "carousel-draggable='On'" in the wrapper "scroll-carousel"  
    //  to enable draggable, and "Off" to disable. The default value is "Off".
    //
    //  Set attribute "carousel-auto-play='On'" in the wrapper "scroll-carousel"  
    //  to enable auto playing, and "Off" to disable. The default value is "Off".
    //
    //  Set attribute "carousel-auto-play-speed='x'" in the wrapper "scroll-carousel"
    //  to change the play speed. X can be any non-negative number. Default speed is 0.5.
    //
    //--------------------------------------------------
    (function () {
        //----------------------
        //  Position object
        //----------------------
        var Position = function (x, y) {
            this.x = x || 0;
            this.y = y || 0;
        };

        //-------------------------
        //  Names constants
        //-------------------------
        const SCROLL_CAROUSEL_WRAPPER_CALSS = ".scroll-carousel",
            SCROLL_CAROUSEL_INNER_WRAPPER_CALSS = ".scroll-carousel-inner",
            SCROLL_CAROUSEL_ITEM_CALSS = ".scroll-carousel-item",
            CAROUSEL_AUTO_PLAY_ATTR = "carousel-auto-play",
            CAROUSEL_AUTO_PLAY_SPEED_ATTR = "carousel-auto-play-speed",
            CAROUSEL_DRAGGABLE_ATTR = "carousel-draggable",
            DRAG_FACTOR = 0.5, //  Drag factor used to make dragging action identical to the movement caused by dragging
            LOOP_RESET_THRESHOLD = 1; //  Threshold value for auto play loop to match the reset position

        //--------------------------------------------
        //  Function scoped variables declarations
        //--------------------------------------------
        var scrollCarouselInnerWrapper,
            scrollCarouselWrapper,
            carouselItems,

            //  Flags to record mouse states
            mouseUp,
            mouseDown,
            mouseIn,
            mouseOut,
            mouseMove,

            //  Mouse positions
            lastMousePos = new Position(),
            currentMousePos = new Position(),
            draggingMousePos = new Position(),

            isDragging = false, //  Flag to check if mouse is dragging
            isDraggable = false; //  Flag to indicate if the carousel is draggable

        //-------------------------------------------
        //  Bind event listener to the carousel items
        //-------------------------------------------
        function bindMouseEvents() {
            var objectsToBind = carouselItems;
            if (typeof objectsToBind !== "undefined" &&
                objectsToBind.length !== 0) {
                //  Disable pointer events
                objectsToBind.find('*').css("pointer-events", ESLSuite.NONE);

                objectsToBind.mouseenter(() => {
                    mouseIn = true;
                    mouseDown = false;
                });

                objectsToBind.mouseout(() => {
                    mouseIn = false;
                    mouseDown = false;
                });

                objectsToBind.mousedown(() => {
                    mouseDown = true;
                    mouseUp = false;
                });

                objectsToBind.mouseup(() => {
                    mouseUp = true;
                    mouseDown = false;
                });
            }
        }

        //  Handle to the draggable carousel wrapper
        scrollCarouselWrapper = $(SCROLL_CAROUSEL_WRAPPER_CALSS);

        if (typeof scrollCarouselWrapper !== "undefined" &&
            scrollCarouselWrapper.length !== 0) {
            //  Handle to the draggable carousel items array
            carouselItems = scrollCarouselWrapper.find(SCROLL_CAROUSEL_ITEM_CALSS);

            //--------------------------------------------------
            //  Check if the draggable attribute is specified
            //--------------------------------------------------
            if (scrollCarouselWrapper.attr(CAROUSEL_DRAGGABLE_ATTR) == "On") {
                isDraggable = true;
            }

            if (typeof carouselItems !== "undefined" &&
                carouselItems.length !== 0) {
                //  Get max elements that the wrapper can show
                let maxElementsToShow = Math.ceil(scrollCarouselWrapper.width() / carouselItems.width());

                //------------------------------------
                //  Create a inner wrapper for items
                //------------------------------------
                let innerWrapper = "<div class='scroll-carousel-inner'></div>";
                $(innerWrapper).prependTo(SCROLL_CAROUSEL_WRAPPER_CALSS);

                //  Handle to the inner items wrapper
                scrollCarouselInnerWrapper = $(SCROLL_CAROUSEL_INNER_WRAPPER_CALSS);

                //---------------------------------------
                //  Check if auto-playing is specified
                //---------------------------------------
                let isAutoPlay = scrollCarouselWrapper.attr(CAROUSEL_AUTO_PLAY_ATTR);
                isAutoPlay = typeof isAutoPlay === "undefined" || isAutoPlay == "Off" ?
                    false : isAutoPlay === "On" ?
                    true : false;

                //------------------------------------------------------------------------------------
                //  Copy the first maxElementsToShow elements to append to the end of the wrapper
                //  and update the handle to idems
                //------------------------------------------------------------------------------------
                for (let i = 0; i < maxElementsToShow; i++) {
                    $(carouselItems[i]).clone().appendTo(scrollCarouselWrapper);
                }
                carouselItems = $(SCROLL_CAROUSEL_ITEM_CALSS);

                //  The count of elements before adding the extra elements for auto playing
                var originalElementsCount = carouselItems.length - maxElementsToShow;

                //-----------------------------------------
                //  Set CSS of the inner wrapper 
                //-----------------------------------------
                let itemsWidthSum = carouselItems.width() * carouselItems.length; // Adding width of all elements together
                let innerWrapperCSS = {
                    "width": itemsWidthSum * 1.5, // Leave extra 50% width
                    "position": "relative",
                    "left": 0,
                    "top": "50%",
                    "transform": "translateY(-50%)",
                    "-webkit-transform": "translateY(-50%)",
                    "-o-transform": "translateY(-50%)",
                    "-moz-transform": "translateY(-50%)",
                };
                ESLSuite.Util.addCSS(scrollCarouselInnerWrapper, innerWrapperCSS);

                //  Move items into the inner wrapper
                carouselItems.appendTo(SCROLL_CAROUSEL_INNER_WRAPPER_CALSS);

                //-------------------------------
                //  Carousel draggable event
                //-------------------------------
                carouselItems.mousemove((event) => {
                    lastMousePos.x = currentMousePos.x;
                    lastMousePos.y = currentMousePos.y;

                    currentMousePos.x = event.pageX;
                    currentMousePos.y = event.pageY;

                    isDragging = false;

                    if (mouseIn && mouseDown) {
                        isDragging = true;
                    }
                });

                bindMouseEvents();

                //  Get user specified loop speed
                var loopSpeed = ESLSuite.Util.getAttrAsNumber(scrollCarouselWrapper, CAROUSEL_AUTO_PLAY_SPEED_ATTR);
                loopSpeed = isNaN(loopSpeed) ? 0.5 : loopSpeed;

                //  Position where to reset the carousel's left postion
                var resetPos = originalElementsCount * $(carouselItems[0]).outerWidth(true);

                //  Starting left position
                const startPos = ESLSuite.Util.getCSSAsNumber(scrollCarouselInnerWrapper, "left");

                //----------------------------
                //  Carousel loop
                //----------------------------
                var scrollCarouselEventLoop = setInterval(() => {
                    //  Current left position of the inner wrapper
                    var currentPos = ESLSuite.Util.getCSSAsNumber(scrollCarouselInnerWrapper, "left");

                    if (!isDraggable) {
                        if (isAutoPlay) {
                            //  Update the current position if auto playing is specified
                            currentPos -= loopSpeed;
                        }
                    } else {
                        if (!isDragging && isAutoPlay) {
                            currentPos -= loopSpeed;
                        } else if (isDragging) {
                            currentPos += (0.5 * (currentMousePos.x - lastMousePos.x));
                        }
                    }

                    //----------------------------------
                    //  Check if it hits the bound, then 
                    //  reset the position. 
                    //----------------------------------
                    if (ESLSuite.Util.isInRange(Math.abs(currentPos),
                            resetPos - LOOP_RESET_THRESHOLD,
                            resetPos + LOOP_RESET_THRESHOLD)) {
                        currentPos = 0;
                    }

                    //  Clamp the left position within the boundary
                    currentPos = ESLSuite.Util.clamp(currentPos, -resetPos, startPos);

                    //  Apply the left position
                    scrollCarouselInnerWrapper.css("left", currentPos);
                });
            }
        }
    })();

    //-------------------------------------------------------------------------
    //  Multi-key query container data structure
    //
    //  A container data structure supporting multi-key query.
    //
    //  The keys of the container are set on construction and CAN NOT be changed 
    //  afterwards for the sake of efficiency. 
    //
    //  * The underlying hash tables are constructed based on the keys.
    //  * The structure of the tables:
    //          
    //     _data
    //         First level of keys
    //              ...
    //                 The last level of keys
    //                     Data: [..., ...., ...](An array containing data)
    //
    //
    //     E.g.
    //           _data = 
    //           {
    //               First_level_1:
    //               {
    //                   The_last_level_1:
    //                   {
    //                       Data: [1, 2, 3, 4]
    //                   }
    //               },
    //               First_level_2:
    //               {
    //                   The_last_level_2:
    //                   {
    //                       Data: [1, 2, 3, 4]
    //                   }
    //                }
    //           }
    //                          
    //  * All tables are javascript objects(i.e. {}) in order to support direct access
    //    with keys as well as being passed by reference among member functions.
    //  * Supported operations so far:
    //      * Insert an elements with keys
    //      * Get an element with keys
    //-------------------------------------------------------------------------
    (function () {

        //--------------------------------------------------------
        //  * Constructors
        //  * 1 overloaded constructors:
        //      * Constructor(keys)
        //        @param keyCount: The count of keys used to query the data
        //
        //---------------------------------------------------------
        ESLSuite.MultikeyQueryContainer = function () {
            //------------------------------------
            //  Initialize all member variables
            //------------------------------------
            this._keyCount = 0;
            this._data = {};
            this._size = 0;

            //---------------------------------------------------------
            //  Switch to use different overloaded constructors
            //---------------------------------------------------------
            switch (arguments.length) {
                case 0:
                    {
                        var msg = "MultiKeyQueryContainer constructor must have arguments!";
                        throw new Error(msg);
                    }
                case 1:
                    {
                        if (typeof arguments[0] === "number") {
                            //------------------------
                            //  Constructor(keyCount)
                            //------------------------
                            this._keyCount = arguments[0];
                        }
                        break;
                    }
            }
        };
        //---------------------------------------------------------------------------------
        //  Get element from the container
        //
        //  Return: An array of elements that match the keys
        //
        //  @param keys: An array containing the exact number of keys that the
        //               user specifies when constructing the container. A key
        //               should be a string and if "All elements" is intended, the 
        //               key should be an empty string.
        //
        //---------------------------------------------------------------------------------
        ESLSuite.MultikeyQueryContainer.prototype.get = function (keys) {
            return this._getDataInTables(this._findTables(keys));
        };

        //---------------------------------------------------------------------------------
        //  Insert element into the container
        //
        //  Return: no
        //
        //  @param keys: An array containing the exact number of keys that the
        //               user specifies when constructing the container. A key
        //               should be a string and if "All elements" is intended, the 
        //               key should be an empty string.
        //  @param element: The element you want to insert into the container.
        //
        //---------------------------------------------------------------------------------
        ESLSuite.MultikeyQueryContainer.prototype.insert = function (keys, element) {
            var tables = this._findTables(keys);

            if (typeof tables === "undefined") {
                return;
            }

            //-------------------------------------
            //  If found, push element to the Data
            //-------------------------------------
            if (Array.isArray(tables)) {
                for (let i = 0; i < tables.length; i++) {
                    tables[i].Data.push(element);
                }
            }
            //------------------------------------
            //  If not found, create the tables 
            //  for keys that are not found
            //------------------------------------
            else {
                //  Get the index of the key absent
                let index = tables.Index;
                //  Get the previous level of tables of the level in which the key is not found
                tables = tables.Result;

                for (let i = 0; i < tables.length; i++) {
                    //  Create an empty table with the name absent
                    tables[i][keys[index]] = {};

                    //--------------------------------------------------
                    //  Create tables for all following levels of keys
                    //--------------------------------------------------
                    let subTable = tables[i][keys[index]];
                    for (let j = index + 1; j < this._keyCount; j++) {
                        subTable[keys[j]] = {};
                        subTable = subTable[keys[j]];
                    }

                    //  Create a Data member in the last level of tables
                    subTable.Data = [element];
                }
            }

            return;
        };

        //-----------------------------------
        //  Private helper member functions
        //-----------------------------------
        //------------------------------------------------------------------------------
        //  Find table(s)
        //
        //  Return: 1. undefined if the parameters are invalid
        //          2. If not found, an object containing:
        //              1) Result: The table containing the level of sub-tables where the key is not found
        //              2) Index: The index of the key that's not found (Range from 0 to keyCount - 1)
        //          3. An array of found tables if found
        //
        //  @param keys: An array containing the exact number of keys that the
        //               user specifies when constructing the container. A key
        //               should be a string and if "All elements" is intended, the 
        //               key should be an empty string.
        //
        //------------------------------------------------------------------------------
        ESLSuite.MultikeyQueryContainer.prototype._findTables = function (keys) {
            if (!Array.isArray(keys)) {
                throw new Error("The parameter is not an array!");
            } else {
                if (keys.length !== this._keyCount) {
                    throw new Error("The passed in keys'length does not match the key count of the container!");
                } else {
                    var tables = [this._data]; //  Start from the base table
                    var res; //  The results found

                    for (let i = 0; i < keys.length; i++) {
                        res = this.__findTablesHelper(keys[i], tables);

                        if (typeof res === "undefined") {
                            return undefined;
                        } else {
                            //  If not found. The __findTablesHelper returns false if not found
                            if (!res) {
                                res = {
                                    Result: tables,
                                    Index: i
                                };

                                return res;
                            }
                        }

                        tables = res;
                    }

                    return tables;
                }
            }
        };

        //------------------------------------------------------------------------------
        //  Find table(s) helper function
        //
        //  Find the sub-table(s) that match a key in an array of tables
        //
        //  Return: 1. undefined if the parameters are invalid
        //          2. False if not found
        //          3. An array of found tables if found
        //
        //  @param key: The key to match in the table(s). Empty string means "All".
        //  @param tables: An array of table(s)
        //------------------------------------------------------------------------------
        ESLSuite.MultikeyQueryContainer.prototype.__findTablesHelper = function (key, tables) {
            //------------------------------
            //  If the parameters are invalid,
            //  return undefined.
            //------------------------------
            if (typeof key !== "string" ||
                !Array.isArray(tables)) {
                return undefined;
            }

            var ret = []; //  Array to return
            var notFound = true; // Flag to check if not found

            for (let i = 0; i < tables.length; i++) {
                //  If all sub-tables is requested, which means, the key is an empty string
                if (key === "") {
                    for (let t in tables[i]) {
                        notFound = false;
                        ret.push(tables[i][t]);
                    }
                } else if (tables[i].hasOwnProperty(key)) {
                    notFound = false;
                    ret.push(tables[i][key]);
                }
            }

            if (notFound) {
                return false;
            }

            return ret;
        };

        //------------------------------------------------------------------------------
        //  Get data in an array of tables
        //
        //  Take the data out of all tables inside the array. In other words, unroll all
        //  objects and take the values out of all properties.
        //
        //  Return: An array of data
        //
        //  @param tables: An array of table(s)
        //------------------------------------------------------------------------------
        ESLSuite.MultikeyQueryContainer.prototype._getDataInTables = function (tables) {

            var ret = [];

            if (typeof tables === "undefined" ||
                !Array.isArray(tables)) {
                return ret;
            }

            for (let i = 0; i < tables.length; i++) {
                ret = ret.concat(tables[i].Data);
            }

            return ret;
        };

    })();
});