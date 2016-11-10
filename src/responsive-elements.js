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
module.exports =
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