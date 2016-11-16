var old = `/* jshint esversion: 6 */
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
var ESLSuite = (function() { return {
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
}; })();;
//---------------------------------------------------
//  Public APIs
//
//  Used to be called in user's code to interact with
//  the code inside the anonymous function scope
//----------------------------------------------------
var ESLSuiteAPI = (function() { return {
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
}; })();;
$(document).ready(() => {
  (function() { //--------------------------------------------------------------------------------
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
return
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
  })(); })();;
  (function() { //-------------------------------------
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
return
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
  })(); })();;
  require("./pop-over-window");
  require("./show-hidden-elements");
  require("./auto-fade-carousel");
  require("./responsive-elements");
  require("./timer");
  require("./scrollable-carousel");
  require("./query-container");
});`;

var news = `(function() { ;
;
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
return
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
    //  @param jqueryObject: DOM element selected by jquery function '\$'
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
  })(); })();`;

console.log(old.replace(/require\("\.\/pop-over-window"\)/, news));