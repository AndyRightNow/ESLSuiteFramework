"use strict";

const extract = require("./extract");
const path = require("path");
const fs = require("fs");
const TableTreeNode = require("./../deps/table-tree");

// Match only require statements with raw relative or absolute paths
const LOCAL_REQUIRE_REGEX = /require\s*\(\s*([\']|[\"])+.*?([\\]|[\/])+.*?\)/g;
// Match any function with the name "require"
const REQUIRE_FUNCTION_REGEX = /require\s*\(/;
// Match any declaration of require. E.g. "const m = require("m")"
const REQUIRE_DECLARATION_REGEX = /(const|var|let|\,)\s*([\w\_\d\$]*)\s*\=\s*/;
// Match a path as the second capture group
const PATH_REGEX = /(\'|\")\s*(.*?)\s*(\'|\")/;
// Match "module.exports =" with any extra spaces
const EXPORTS_EQUAL_REGEX = /module\s*\.\s*exports\s*\=/;
// Match "module.exports" with any extra spaces
const EXPORTS_REGEX = /module\s*\.\s*exports\s*/;
const JS_SUFFIX = ".js";

/*
 * Inline all specified files that fit the given regex and replace the HTML content in the argument object
 * passed in with the new text
 *
 * @param {string} options.path Path name of the HTML file name to process
 * @param {string} options.content Content of the HTML file name to process
 * @param {string} options.type File type, CSS or JS (case-insensitive)
 * @param {RegExp} options.fileRegEx Regular expression representing the file names
 */
function inlineFiles(options) {
  // Note: exclude all links with any type of URL reference or absolute path
  const CSS_INLINE_TAG_REGEX_START = /<link.*?rel\s*=\s*"stylesheet".*?href\s*=\s*"(?!\w+\:).*/;
  const JS_INLINE_TAG_REGEX_START = /<script.*?src\s*=\s*"(?!\w+\:).*/;
  const CSS_INLINE_TAG_REGEX_END = /".*?\>/;
  const JS_INLINE_TAG_REGEX_END = /".*?\>\s*?<\/script>/;
  const CSS_HREF_REGEX = /href\s*=\s*"(.*)"/;
  const JS_SRC_REGEX = /src\s*=\s*"(.*)"/;

  // Check for argument object  
  if (typeof options === "undefined") {
    throw new Error("No argument object specified!");
  }

  var htmlPathName = options.path,
    htmlText = options.content,
    fileRegEx = options.fileRegEx,
    type = options.type ?
    options.type.toLowerCase() === "css" || options.type.toLowerCase() === "js" ? options.type : "css" : "css";

  // Check for invalid dirname and regex
  if (!htmlText || !fileRegEx || !(fileRegEx instanceof RegExp)) {
    throw new Error("Invalid HTML file or file name regular expressions");
  }

  // Get dirname of the given path name  
  const htmlDirname = path.dirname(htmlPathName);

  // Compose the regex to find the required links  
  const FILE_INLINE_REGEX = new RegExp(
    (type === "css" ? CSS_INLINE_TAG_REGEX_START.source : JS_INLINE_TAG_REGEX_START.source) +
    fileRegEx.source +
    (type === "css" ? CSS_INLINE_TAG_REGEX_END.source : JS_INLINE_TAG_REGEX_END.source),
    'g');

  // Extract all css files and combine them to one file
  var matchedLinks = htmlText.match(FILE_INLINE_REGEX);
  var fileText = "";
  var fileDirname, thisFileText;
  for (let i = 0, ll = matchedLinks.length; i < ll; i++) {
    fileDirname = path.resolve(
      htmlDirname,
      matchedLinks[i].match(type === "css" ? CSS_HREF_REGEX : JS_SRC_REGEX)[1]);
    thisFileText = extract.extractUTF8(fileDirname);

    if (type === "css") {
      fileText += thisFileText !== null ? thisFileText : "";
    } else {
      fileText += (`<script>\n${thisFileText}\n</script>\n`);
    }
  }
  // Remove matched links
  htmlText = htmlText.replace(FILE_INLINE_REGEX, "");

  // Build the corresponding tag and insert it into the HTML text 
  var finalTag, tagToReplace;
  if (type === "css") {
    finalTag = "<style>\n" + fileText + "\n</style>\n</head>";
    tagToReplace = "</head>";
  } else {
    finalTag = "</body>\n" + fileText;
    tagToReplace = "</body>";
  }
  htmlText = htmlText.replace(tagToReplace, finalTag);

  options.content = htmlText;
}

/*
 * Helper function to inline all imports (requires) in a js file
 *
 * @param {string} p Path name of the js file name to process
 * @param {string} content Content of the js file name to process
 * @param {TableTreeNode} table The table (node) of this level
 */
function _inlineImportsHelper(p, content, table) {
  // Get all requires and paths
  var reqs = content.match(LOCAL_REQUIRE_REGEX);

  // Valid requires exist
  if (reqs) {
    for (let i = 0, ll = reqs.length; i < ll; i++) {
      // Get the path name in the require function and concatenate it with the current dir
      let pathName = path.resolve(path.dirname(p), reqs[i].match(PATH_REGEX)[2]);

      // Get the file name in the path name. E.g. "extract" in "./utils/extract" and remove ".js" suffix
      let fileName = pathName.match(/(.*)[/\\](.*)(\.js)*/).splice(-2)[0];

      // If the require is currently visible, omit it and delete the declaration.
      if (table.existsAbove(fileName)) {
        let newReqRegex = reqs[i];
        newReqRegex.match(/[\(\)\/\.]/g).map(val => {
          newReqRegex = newReqRegex.replace(val, "\\" + val);
        });

        content = content.replace(new RegExp(REQUIRE_DECLARATION_REGEX.source + newReqRegex), "");
      }
      // Else recursively call this function on it and add it to the visible table of the current level
      else {
        table.insert(fileName, true);
        // Replace 'require' with IIFE string
        content = content.replace(
          reqs[i],
          () => { return _inlineImportsHelper(pathName, extract.extractUTF8(pathName + JS_SUFFIX), table.next(fileName)) });
      }
    }
  }

  // If there is a "module.exports = ", replace it with "return"
  if (content.match(EXPORTS_EQUAL_REGEX)) {
    content =
      "(function() { " +
      content.replace(EXPORTS_EQUAL_REGEX, "return") +
      " })();";
  } else {
    // Else if there is no "module.exports = ", replace all "module.exports" with "INLINEIMPORTSRETVARNAME" and add a "var INLINEIMPORTSRETVARNAME = {};" at the beginning of the text. Wrap the text in an IIFE and return the IIFE string
    content =
      "(function() { var INLINEIMPORTSRETVARNAME = {}; " +
      content.replace(EXPORTS_REGEX, "INLINEIMPORTSRETVARNAME") +
      " return INLINEIMPORTSRETVARNAME; })();";
  }

  // Check if there is any global require left  
  if (content.match(REQUIRE_FUNCTION_REGEX)) {
    throw new Error("Files contain global dependencies");
  }

  return content;
}

/*
 * Inline all imports (requires) in a js file
 *
 * @param {string} options.path Path name of the js file name to process
 * @param {string} options.content Content of the js file name to process
 */
function inlineImports(options) {
  // Check arguments
  if (!options ||
    !options.path ||
    !options.content ||
    typeof options.path !== "string" ||
    typeof options.content !== "string") {
    throw new Error("Invalid arguments");
  }

  // Build a table tree root node
  var tableRoot = new TableTreeNode();

  options.content = _inlineImportsHelper(options.path, options.content, tableRoot);
}

module.exports = {
  inlineFiles: inlineFiles,
  inlineImports: inlineImports
};