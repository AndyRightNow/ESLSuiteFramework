//--------------------------------------------------
// 
//  Scrollable Carousel
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
module.exports =
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