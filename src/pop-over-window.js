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
module.exports =
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