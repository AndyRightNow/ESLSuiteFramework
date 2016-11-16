"use strict";

const fs = require("fs");

/**
 * Extract all text from a ASCII encoding file and return as a string
 *
 * @param pathName Directory name including the file name to extract
 * @return A string object containing all text in the file or null if the pathName does not exist
 */
function extractASCII(pathName) {
  return fs.existsSync(pathName) ? fs.readFileSync(pathName, {
    encoding: "ASCII"
  }) : null;
}

/**
 * Extract all text from a UTF-8 encoding file and return as a string
 *
 * @param pathName Directory name including the file name to extract
 * @return A string object containing all text in the file or null if the pathName does not exist
 */
function extractUTF8(pathName) {
  return fs.existsSync(pathName) ? fs.readFileSync(pathName, {
    encoding: "utf-8"
  }) : null;
}

module.exports = {
  extractASCII: extractASCII,
  extractUTF8: extractUTF8
};