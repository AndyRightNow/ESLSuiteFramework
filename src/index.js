/* jshint esversion: 6 */
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
var ESLSuite = require("./eslsuite");

//---------------------------------------------------
//  Public APIs
//
//  Used to be called in user's code to interact with
//  the code inside the anonymous function scope
//----------------------------------------------------
var ESLSuiteAPI = require("./eslsuite-api");

$(document).ready(() => {

  require("./scroll-to-show");

  require("./scroll-to-internal-link");

  require("./pop-over-window");

  require("./show-hidden-elements");

  require("./auto-fade-carousel");

  require("./responsive-elements");

  require("./timer");

  require("./scrollable-carousel");

  require("./query-container");
});