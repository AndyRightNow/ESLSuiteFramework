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
module.exports =
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