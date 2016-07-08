/* jshint esversion: 6 */

//---------------------------------------------------------
//                  ESL Suite Framework JS
//
//  The framework encapsulate animation effects and widgets, 
//  all of which are in a certain CSS style.
//
//---------------------------------------------------------

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
        _changeRebindState: function(state) {
            ESLSuiteAPI.PopOutWindow._rebindState = state;
        },

        //----------------------------------------------------------------------
        //  Public member function that sends rebind signal to the widget code
        //----------------------------------------------------------------------
        rebindElements: function() {
            ESLSuiteAPI.PopOutWindow._changeRebindState(true);
        }
    },
};

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
        //  Check if it's mobile version
        //-------------------------------
        isMobile: function() {
            return $(window).width() <= MOBILE_WIDTH;
        },

        //---------------------------------------------
        //  Check if a number is within certain range
        //---------------------------------------------
        isInRange: function(number, rangeLow, rangeHigh) {
            return number >= rangeLow && number <= rangeHigh;
        },

        //--------------------------------------------------------------------
        //  Get a attribute value of a HTML element and convert it to a number
        //--------------------------------------------------------------------
        getAttrAsNumber: function(jqueryObject, attrName) {
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
        getCSSAsNumber: function(jqueryObject, propertyName) {
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
        clamp: function(value, low, high) {
            return value < low ? low : value > high ? high : value;
        }
    };

    //--------------------------------------------------------------------------------
    //
    //  Scroll to show 
    //
    //  Usage: 
    //  
    //  Add CSS Class "scrollshow"
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
        const TRANSITION_600MS = "transition600ms";
        const TRANSITION_TIME = 600; //Transition time in millisecond

        //  Flag used to indicate if current element is shown
        var isCurrentElementShown = false;
        //  Flag used to indicate if the next element can be fetched
        var canGetNextElement = true;

        //  Current element to show
        var currElem;

        //  A queue used to store the actions of removing transitions
        var removeTransitionQueue = [];

        //  Add transitions to all scrollshow elements
        $("." + SCROLL_SHOW).addClass(TRANSITION_600MS);

        var ScrollToShowEventLoop = setInterval(() => {

            //--------------------------------------
            //  Get the collection of elements with
            //  class "scrollshow". If the collection's
            //  length equals to zero or the collection is 
            //  undefined, clear the interval.
            //--------------------------------------
            var elements = Array.from($("." + SCROLL_SHOW));
            if (typeof elements === "undefined" ||
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

                    if (windowBottom >= curEleBottom) {

                        $(currElem).removeClass(SCROLL_SHOW); //Show default effect

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
                        setTimeout(function() { 
                            if (removeTransitionQueue.length > 0){
                                let topEle = removeTransitionQueue[0];
                                if (!$(topEle).hasClass(SCROLL_SHOW)){
                                    $(topEle).removeClass(TRANSITION_600MS);
                                    removeTransitionQueue.shift();
                                }
                            }
                        }, TRANSITION_TIME - 1);
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
    //  Add CSS Class "scrolllink"
    //  (case sensitive) to the HTML element
    //  you want to animate.
    //
    //-----------------------------------
    (function() {
        const ANIMATE_TIME = 600;

        $(".scrolllink").on('click', function(event) {
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
    //  Popped-out window
    //
    //  Usage: 
    //  
    //  Add CSS Class 'popoverbtn'
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
        const MOBILE_WINDOW_WIDTH = "100vw";
        const MOBILE_WINDOW_HEIGHT = "80vh";

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

        //-------------------------------
        //  Popped out window jquery vars
        //-------------------------------
        var background = $('.popoverbg'),
            wnd = $('.popoverwnd'),
            close = $('.close');

        //  Currrent popped out content
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
                let thisCont = "popcont" + i;
                let thisBtn = "popbtn" + i;

                let thisBtnElements = $("." + thisBtn);

                if (typeof thisBtnElements !== "undefined" &&
                    thisBtnElements.length > 0) {
                    for (let j = 0; j < thisBtnElements.length; j++) {
                        $(thisBtnElements[j]).click((event) => {
                            //---------------------------------------------------
                            //  Adjust the size of the pop over window on mobile
                            //---------------------------------------------------
                            if (Utility.isMobile()) {
                                wnd.css("width", MOBILE_WINDOW_WIDTH).css("height", MOBILE_WINDOW_HEIGHT);
                            }

                            //------------------------------------------------------------
                            //  Prevent default action and show the window when
                            //  1. Not on mobile
                            //  2. On mobile and "popbtn-nomobile" not specified for the button
                            //------------------------------------------------------------
                            if ( !Utility.isMobile() ||
                                (Utility.isMobile() && !$("." + thisBtn).hasClass(NO_MOBILE)) ) {
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
                                curPopCont.removeClass(NONE);
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
                let thisBtn = ".popbtn" + i;
                $(thisBtn).off("click");
            }
        }

        //-----------------------------
        //  Hide all the content
        //-----------------------------
        for (let i = 1; i <= POP_CONT_MAX; i++) {
            let thisContClass = "." + "popcont" + i;
            if (!$(thisContClass).hasClass(NONE)) {
                $(thisContClass).addClass(NONE);
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
    (function() {
        //-------------------------
        //  Constants
        //-------------------------
        const   ALL = "All",
                HALF = "Half",
                QUARTER = "Quarter",
                NUM_TO_SHOW = "num-to-show",
                HIDDEN_ITEM = "hiddenitem";

        //  Hidden items
        var hiddenItems = $("." + HIDDEN_ITEM);
        //  Button to click to show
        var showBtn = $(".showhiddenitembtn");
        //  How many element to show on one click
        var numToShow = ALL;

        //------------------------------------
        //  Get user specified number to show
        //------------------------------------
        var specifiedNumToShow = showBtn.attr(NUM_TO_SHOW);
        if (typeof specifiedNumToShow !== "undefined") {    //  If the attribute exists
            //-----------------------------------
            //  Check if the user input a number
            //-----------------------------------
            let thisNum = parseInt(specifiedNumToShow);
            if (!isNaN(thisNum)) {
                numToShow = thisNum;
            }
            else {
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
                    showBtn.addClass(NONE);
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
    //  Responsive element properties
    //
    //  Usage: 
    //  
    //  Add attribute to a HTML element: 
    //  1. adapt-height = "Sibling-n" means setting the height
    //  of the element to the height of its nth sibling
    //  e.g. "Sibling-1" (n starts from 1)
    //--------------------------------------------------
    (function() {
        //------------------------
        //  Adapt height targets
        //------------------------
        const SIBLING = "Sibling";

        var ResponsiveElementHeightInterval = setInterval(() => {
            let elements = $("[adapt-height]");
            if (typeof elements === "undefined" ||
                elements.length === 0) { //  Check if elements with the attribute don't exist
                clearInterval(ResponsiveElementHeightInterval);
            }

            let isAllInvalid = true; //  Flag used to check if there is at least one valid attribute value
            for (let i = 0; i < elements.length; i++) { //  Use native for loop to make the loop within this scope
                let thisAttr = $(elements[i]).attr('adapt-height');
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
    (function() {
        //-------------------------------------------
        //  Count down display class names constants
        //-------------------------------------------
        const COUNT_DOWN_YEAR = "count-down-year";
        const COUNT_DOWN_MONTH = "count-down-month";
        const COUNT_DOWN_DAY = "count-down-day";
        const COUNT_DOWN_HOUR = "count-down-hour";
        const COUNT_DOWN_MINUTE = "count-down-minute";
        const COUNT_DOWN_SECOND = "count-down-second";
        const COUNT_DOWN_YEAR_CLASS = ".count-down-year";
        const COUNT_DOWN_MONTH_CLASS = ".count-down-month";
        const COUNT_DOWN_DAY_CLASS = ".count-down-day";
        const COUNT_DOWN_HOUR_CLASS = ".count-down-hour";
        const COUNT_DOWN_MINUTE_CLASS = ".count-down-minute";
        const COUNT_DOWN_SECOND_CLASS = ".count-down-second";

        const COUNT_DOWN_STATE_ATTR = "count-down-state";
        const COUNT_DOWN_START_ATTR = "count-down-start";
        const COUNT_DOWN_END_ATTR = "count-down-end";
        const TIME_ZONE_ATTR = "time-zone";

        const COUNT_DOWN_WRAPPER_CLASS = ".count-down";

        //---------------------------------
        //  Conversion constants
        //---------------------------------
        const YEAR_SEC = 31536000;
        const MONTH_SEC = 2592000;
        const DAY_SEC = 86400;
        const HOUR_SEC = 3600;
        const MIN_SEC = 60;

        //---------------------------------------------------------------------------
        //  UTC date variables and a helper function used to get current UTC date
        //---------------------------------------------------------------------------
        var date, UTCYear, UTCMonth, UTCDate, UTCHour, UTCMin, UTCSec, UTCTimeInMillisec;

        function getThisUTCTime() {
            date = new Date();
            UTCYear = date.getUTCFullYear();
            UTCMonth = date.getUTCMonth();
            UTCDate = date.getUTCDate();
            UTCHour = date.getUTCHours();
            UTCMin = date.getUTCMinutes();
            UTCSec = date.getUTCSeconds();
            UTCTimeInMillisec = Date.UTC(UTCYear, UTCMonth, UTCDate, UTCHour, UTCMin, UTCSec);
        }

        //-----------------------------------------------------------------
        //  Helper function to convert seconds to different parts of time
        //  Return: an object with 6 members: year, month, day, hour, min, sec 
        //-----------------------------------------------------------------
        function extractTime(time) {
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
                let timeZone = Utility.getAttrAsNumber(TIME_ZONE_ATTR);
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
                countDownState = typeof countDownState === "undefined" ||
                    (countDownState != "On" &&
                        countDownState != "Off") ?
                    "On" : countDownState === "On" ? true : false;

                getThisUTCTime();
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
                        getThisUTCTime();

                        //  Time period between current time and end time in seconds
                        var timeDifPeroidInSec = (countDownEnd - UTCTimeInMillisec) / 1000;

                        //  Extract years, months, days, minutes and seconds from the seconds period
                        var extractedTime = extractTime(timeDifPeroidInSec);

                        //--------------------------------------
                        //  Show the time
                        //--------------------------------------
                        $(COUNT_DOWN_YEAR_CLASS).text(extractedTime.year);
                        $(COUNT_DOWN_MONTH_CLASS).text(extractedTime.month);
                        $(COUNT_DOWN_DAY_CLASS).text(extractedTime.day);
                        $(COUNT_DOWN_HOUR_CLASS).text(extractedTime.hour);
                        $(COUNT_DOWN_MINUTE_CLASS).text(extractedTime.minute);
                        $(COUNT_DOWN_SECOND_CLASS).text(extractedTime.second);
                    });
                }
            }
        }
    })();

    //--------------------------------------------------
    // 
    //  Draggable carousel
    //
    //  Usage: 
    //  
    //  Add CSS class "draggable-carousel" to the 
    //  wrapper of carousel items and add "draggable-carousel-item" to the 
    //  items of carousel. Items should be of the same width
    //  and height. 
    //  
    //  Add CSS class "carousel-control-left" and "carousel-control-right"
    //  to elements you want to use as left and right control for the 
    //  carousel. It will shift to left/right for 1 element for every click.
    //
    //  Set attribute "carousel-auto-play='On'" in the wrapper "draggable-carousel"  
    //  to enable auto playing, and "Off" to disable. The default value is "Off".
    //
    //  Set attribute "carousel-auto-play-speed='x'" in the wrapper "draggable-carousel"
    //  to change the play speed. X can be any non-negative number. Default speed is 0.5.
    //
    //--------------------------------------------------
    (function() {
        //----------------------
        //  Position object
        //----------------------
        var Position = function(x, y) {
            this.x = x;
            this.y = y;
        };

        //-------------------------
        //  Names constants
        //-------------------------
        const DRAGGABLE_CAROUSEL_WRAPPER_CALSS = ".draggable-carousel";
        const DRAGGABLE_CAROUSEL_INNER_WRAPPER_CALSS = ".draggable-carouse-inner";
        const DRAGGABLE_CAROUSEL_ITEM_CALSS = ".draggable-carousel-item";
        const CAROUSEL_AUTO_PLAY_ATTR = "carousel-auto-play";
        const CAROUSEL_AUTO_PLAY_SPEED_ATTR = "carousel-auto-play-speed";

        //  Threshold value for auto play loop to match the reset position
        const LOOP_RESET_THRESHOLD = 1;

        //--------------------------------------------
        //  Function scoped variables declarations
        //--------------------------------------------
        var draggableCarouselInnerWrapper,
            draggableCarouselWrapper,
            carouselItems;

        //  Flag to record if the mouse events are bound
        var isEventBound = false;
        //  Flags to record mouse states
        var mouseUp, mouseDown, mouseIn, mouseOut, mouseMove;
        //  Mouse positions
        var lastMousePos = new Position(0, 0),
            currentMousePos = new Position(0, 0),
            draggingMousePos = new Position(0, 0);

        //  Variable to check if mouse is dragging
        var isDragging = false;

        //-------------------------------------------
        //  Bind event listener to the carousel items
        //-------------------------------------------
        function bindMouseEvents() {
            if (!isEventBound) {
                let objectsToBind = carouselItems;
                if (typeof objectsToBind !== "undefined" ||
                    objectsToBind.length !== 0) {
                    objectsToBind.find('*').css("pointer-events", "none");
                    objectsToBind.mouseenter(() => { mouseIn = true; });
                    objectsToBind.mouseout(() => { mouseIn = false; });
                    objectsToBind.mousedown(() => {
                        mouseDown = true;
                        mouseUp = false;
                    });
                    objectsToBind.mouseup(() => {
                        mouseUp = true;
                        mouseDown = false;
                    });
                    isEventBound = true;
                }
            }
        }

        //  Handle to the draggable carousel wrapper
        draggableCarouselWrapper = $(DRAGGABLE_CAROUSEL_WRAPPER_CALSS);

        if (typeof draggableCarouselWrapper !== "undefined" &&
            draggableCarouselWrapper.length !== 0) {
            //  Handle to the draggable carousel items array
            carouselItems = draggableCarouselWrapper.find(DRAGGABLE_CAROUSEL_ITEM_CALSS);

            if (typeof carouselItems !== "undefined" &&
                carouselItems.length !== 0) {
                //  Get max elements that the wrapper can show
                let maxElementsToShow = parseInt(draggableCarouselWrapper.width() / carouselItems.width());

                //------------------------------------
                //  Create a inner wrapper for items
                //------------------------------------
                let innerWrapper = "<div class='draggable-carouse-inner'></div>";
                $(innerWrapper).prependTo(DRAGGABLE_CAROUSEL_WRAPPER_CALSS);

                //  Handle to the inner items wrapper
                draggableCarouselInnerWrapper = $(DRAGGABLE_CAROUSEL_INNER_WRAPPER_CALSS);

                //---------------------------------------
                //  Check if auto-playing is specified
                //---------------------------------------
                let isAutoPlay = draggableCarouselWrapper.attr(CAROUSEL_AUTO_PLAY_ATTR);
                isAutoPlay = typeof isAutoPlay === "undefined" || isAutoPlay == "Off" ?
                    false : isAutoPlay === "On" ? true : false;

                if (isAutoPlay) {
                    //------------------------------------------------------------------------------------
                    //  Copy the first maxElementsToShow elements to append to the end of the wrapper
                    //------------------------------------------------------------------------------------
                    for (let i = 0; i < maxElementsToShow; i++) {
                        $(carouselItems[i]).clone().appendTo(draggableCarouselWrapper);
                    }

                    //  Update the handle to items
                    carouselItems = $(DRAGGABLE_CAROUSEL_ITEM_CALSS);
                }
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
                Utility.addCSS(draggableCarouselInnerWrapper, innerWrapperCSS);

                //  Move items into the inner wrapper
                carouselItems.appendTo(DRAGGABLE_CAROUSEL_INNER_WRAPPER_CALSS);

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
                var loopSpeed = Utility.getAttrAsNumber(draggableCarouselWrapper, CAROUSEL_AUTO_PLAY_SPEED_ATTR);
                loopSpeed = isNaN(loopSpeed) ? 0.5 : loopSpeed;

                //  Position where to reset the carousel's left postion
                var resetPos = originalElementsCount * $(carouselItems[0]).outerWidth(true);

                //  Starting left position
                const startPos = Utility.getCSSAsNumber(draggableCarouselInnerWrapper, "left");

                //----------------------------
                //  Carousel loop
                //----------------------------
                var draggableCarouselEventLoop = setInterval(() => {
                    //  Current left position of the inner wrapper
                    var currentPos = Utility.getCSSAsNumber(draggableCarouselInnerWrapper, "left");

                    if (!isDragging) {
                        if (isAutoPlay) {
                            //  Update the current position if auto playing is specified
                            currentPos -= loopSpeed;
                        }
                    } else {
                        currentPos += (0.5 * (currentMousePos.x - lastMousePos.x));
                    }

                    //----------------------------------
                    //  Check if it hits the bound, then 
                    //  reset the position. 
                    //----------------------------------
                    if (Utility.isInRange(
                            Math.abs(currentPos),
                            resetPos - LOOP_RESET_THRESHOLD,
                            resetPos + LOOP_RESET_THRESHOLD)) {
                        currentPos = 0;
                    }

                    //  Clamp the left position within the boundary
                    currentPos = Utility.clamp(currentPos, -resetPos, startPos);

                    //  Apply the left position
                    draggableCarouselInnerWrapper.css("left", currentPos);
                });
            }
        }
    })();
});

