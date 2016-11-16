const ESLSuite = require("./eslsuite");
const ESLSuiteAPI = require("./eslsuite-api");
module.exports =
  (function () {
    const SHOW_PROP = "translate(-50%, -50%) scale(1)",
      HIDE_PROP = "translate(-50%, -50%) scale(0)",
      ANIMATE_TIME = 400,
      NO_OVERFLOW = "nooverflow",
      POP_CONT_MAX = 50,
      POP_BUTTON_NO_MOBILE = "popbtn-nomobile",
      MOBILE_WINDOW_WIDTH = "100vw",
      MOBILE_WINDOW_HEIGHT = "80vh",
      POP_OVER_BACKGROUND = "popoverbg",
      POP_OVER_WINDOW = "popoverwnd",
      POP_OVER_CONTENT = "popovercontent",
      POP_BTN = "popbtn",
      POP_CONT = "popcont";
    (function () {
      var bg = "<div class='" + POP_OVER_BACKGROUND + " " + ESLSuite.NONE + "'></div>";
      $(bg).appendTo('body');
      var wnd = "<div class='" + POP_OVER_WINDOW + " whiteback text-center'></div>";
      $(wnd).appendTo("." + POP_OVER_BACKGROUND);
      var closebtn = "<div class='close glyphicon glyphicon-remove'></div>";
      $(closebtn).appendTo("." + POP_OVER_WINDOW);
      $("." + POP_OVER_CONTENT).appendTo("." + POP_OVER_WINDOW).removeClass(ESLSuite.NONE);
    })();
    var background = $("." + POP_OVER_BACKGROUND),
      wnd = $("." + POP_OVER_WINDOW),
      close = $('.close');
    var curPopCont = null;
    function transform(jqueryObject, propValue) {
      if (typeof jqueryObject !== "undefined" &&
        typeof propValue !== "undefined") {
        jqueryObject.css("transform", propValue);
        jqueryObject.css("-webkit-transform", propValue);
        jqueryObject.css("-o-transform", propValue);
        jqueryObject.css("-moz-transform", propValue);
      }
    }
    function bindButtonClickEvents() {
      for (let i = 1; i <= POP_CONT_MAX; i++) {
        let thisCont = POP_CONT + i,
          thisBtn = POP_BTN + i,
          thisBtnElements = $("." + thisBtn);

        if (typeof thisBtnElements !== "undefined" &&
          thisBtnElements.length > 0) {
          for (let j = 0; j < thisBtnElements.length; j++) {
            $(thisBtnElements[j]).click((event) => {
              if (ESLSuite.Util.isMobile()) {
                wnd.css("width", MOBILE_WINDOW_WIDTH);
              }
              if (!ESLSuite.Util.isMobile() ||
                (ESLSuite.Util.isMobile() && !$("." + thisBtn).hasClass(POP_BUTTON_NO_MOBILE))) {
                event.preventDefault();
                background.fadeIn(ANIMATE_TIME);
                transform(wnd, SHOW_PROP);
                $('html').toggleClass(NO_OVERFLOW);
                curPopCont = $("." + thisCont);
                curPopCont.removeClass(ESLSuite.NONE);
              }
            });
          }
        }
      }
    }
    function clearButtonClickEvents() {
      for (let i = 1; i <= POP_CONT_MAX; i++) {
        let thisBtn = "." + POP_BTN + i;
        $(thisBtn).off("click");
      }
    }
    for (let i = 1; i <= POP_CONT_MAX; i++) {
      let thisContClass = "." + POP_CONT + i;
      if (!$(thisContClass).hasClass(ESLSuite.NONE)) {
        $(thisContClass).addClass(ESLSuite.NONE);
      }
    }
    setTimeout(() => {
      bindButtonClickEvents();
    });
    var ESLSuiteAPI_PopOutWindow_EventLoop = setInterval(() => {
      if (ESLSuiteAPI.PopOutWindow._rebindState) {
        clearButtonClickEvents();
        bindButtonClickEvents();
        ESLSuiteAPI.PopOutWindow._changeRebindState(false);
      }
    });
    close.click(function (event) {
      transform(wnd, HIDE_PROP);
      $("html").toggleClass(NO_OVERFLOW);
      background.fadeOut(ANIMATE_TIME);

      setTimeout(function () {
        curPopCont.toggleClass(ESLSuite.NONE);
      }, ANIMATE_TIME);
    });
  })();