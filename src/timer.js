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
module.exports =
  (function () {
    //-------------------------------------------
    //  Count down display class names constants
    //-------------------------------------------
    const COUNT_DOWN_YEAR = "count-down-year",
      COUNT_DOWN_MONTH = "count-down-month",
      COUNT_DOWN_DAY = "count-down-day",
      COUNT_DOWN_HOUR = "count-down-hour",
      COUNT_DOWN_MINUTE = "count-down-minute",
      COUNT_DOWN_SECOND = "count-down-second",
      COUNT_DOWN_YEAR_CLASS = ".count-down-year",
      COUNT_DOWN_MONTH_CLASS = ".count-down-month",
      COUNT_DOWN_DAY_CLASS = ".count-down-day",
      COUNT_DOWN_HOUR_CLASS = ".count-down-hour",
      COUNT_DOWN_MINUTE_CLASS = ".count-down-minute",
      COUNT_DOWN_SECOND_CLASS = ".count-down-second",

      COUNT_DOWN_STATE_ATTR = "count-down-state",
      COUNT_DOWN_START_ATTR = "count-down-start",
      COUNT_DOWN_END_ATTR = "count-down-end",
      TIME_ZONE_ATTR = "time-zone",

      COUNT_DOWN_WRAPPER_CLASS = ".count-down";

    //---------------------------------
    //  Conversion constants
    //---------------------------------
    const YEAR_SEC = 31536000,
      MONTH_SEC = 2592000,
      DAY_SEC = 86400,
      HOUR_SEC = 3600,
      MIN_SEC = 60;

    //---------------------------------------------------------------------------
    //  UTC date variables and a helper function used to get current UTC date
    //---------------------------------------------------------------------------
    var date, UTCYear, UTCMonth, UTCDate, UTCHour, UTCMin, UTCSec, UTCTimeInMillisec;

    function getCurrentUTCTime() {
      date = new Date();
      UTCYear = date.getUTCFullYear();
      UTCMonth = date.getUTCMonth();
      UTCDate = date.getUTCDate();
      UTCHour = date.getUTCHours();
      UTCMin = date.getUTCMinutes();
      UTCSec = date.getUTCSeconds();
      UTCTimeInMillisec = Date.UTC(
        UTCYear,
        UTCMonth,
        UTCDate,
        UTCHour,
        UTCMin,
        UTCSec);
    }

    //-----------------------------------------------------------------
    //  Helper function to convert seconds to different parts of time
    //  Return: an object with 6 members: year, month, day, hour, min, sec 
    //-----------------------------------------------------------------
    function formatTimeFromSeconds(time) {
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
        let timeZone = ESLSuite.Util.getAttrAsNumber(TIME_ZONE_ATTR);
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
        countDownState =
          typeof countDownState === "undefined" ||
          (countDownState !== "On" && countDownState !== "Off") ?
          false : countDownState === "On" ? true : false;

        getCurrentUTCTime();
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
            getCurrentUTCTime();

            //  Time period between current time and end time in seconds
            var timeDifPeroidInSec = (countDownEnd - UTCTimeInMillisec) / 1000;

            //  Extract years, months, days, minutes and seconds from the seconds period
            var extractedTime = formatTimeFromSeconds(timeDifPeroidInSec);

            //--------------------------------------
            //  Show the time
            //--------------------------------------
            $(COUNT_DOWN_YEAR_CLASS).text(extractedTime.year);
            $(COUNT_DOWN_MONTH_CLASS).text(extractedTime.month);
            $(COUNT_DOWN_DAY_CLASS).text(extractedTime.day);
            $(COUNT_DOWN_HOUR_CLASS).text(extractedTime.hour);
            $(COUNT_DOWN_MINUTE_CLASS).text(extractedTime.minute);
            $(COUNT_DOWN_SECOND_CLASS).text(extractedTime.second);
          }, 999);
        }
      }
    }
  })();