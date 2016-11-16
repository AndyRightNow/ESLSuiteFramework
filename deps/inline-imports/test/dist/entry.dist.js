(function() { var INLINEIMPORTSRETVARNAME = {}; const first = (function() { return function SomeFirstFunc() {
  console.log("First func");
};
 })();;
const second = (function() { ;

return function SomeSecondFunc() {
  console.log("Second func");
};
 })();;
const third = (function() { var INLINEIMPORTSRETVARNAME = {}; ;

INLINEIMPORTSRETVARNAME.SomeThirdFunc = function () {
  console.log("Third func");
}; return INLINEIMPORTSRETVARNAME; })();;

first(), second(), third.SomeThirdFunc(); return INLINEIMPORTSRETVARNAME; })();