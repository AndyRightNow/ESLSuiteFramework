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
module.exports =
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