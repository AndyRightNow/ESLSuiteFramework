const ESLSuite = require("./eslsuite");

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
module.exports =
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