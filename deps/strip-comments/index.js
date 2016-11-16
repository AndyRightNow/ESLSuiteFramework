"use strict";

const COMMENT_REGEX = /([\s\n\r]*?([/][/]).*?[\n\r]+?)|(([/][*])(.|\s)*?([*][/]))/;

/**
 * Strip off all comments in a file
 *
 * @param {string} options.path Path name of the HTML file name to process
 * @param {string} options.content Content of the HTML file name to process
 */
function stripComments(options) {
  // Check arguments
  if (!options ||
    !options.path ||
    !options.content ||
    typeof options.path !== "string" ||
    typeof options.content !== "string") {
    throw new Error("Invalid arguments");
  }

  while (options.content.match(COMMENT_REGEX)) {
    options.content = options.content.replace(COMMENT_REGEX, "");
  }
}

module.exports = stripComments;