"use strict";

const NEWLINE_REGEX = /[\n\r]+/g;

/**
 * Strip off all newlines in a file
 *
 * @param {string} options.path Path name of the HTML file name to process
 * @param {string} options.content Content of the HTML file name to process
 */
function stripNewlines(options) {
  // Check arguments
  if (!options ||
    !options.path ||
    !options.content ||
    typeof options.path !== "string" ||
    typeof options.content !== "string") {
    throw new Error("Invalid arguments");
  }

  options.content = options.content.replace(NEWLINE_REGEX, "");
}

module.exports = stripNewlines;