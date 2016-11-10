module.exports = {
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