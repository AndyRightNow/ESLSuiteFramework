"use strict";

const extract = require("./../utils/extract");
const path = require("path");
const fs = require("fs");

function TaskTarget(argObj) {
  this.path = argObj.path;
  this.content = argObj.content;
}

/*
 * Run a function on the current task target
 *
 * @param {Function} func Function to run on the task target
 * @param {Object} argObj Optional Object to pass to the funcion passed in 
 * @return {TaskTarget} A task target for task chaining
 */
TaskTarget.prototype.task = function (func, argObj) {
  var newTaskTarget = new TaskTarget({
    path: this.path,
    content: this.content
  });

  var hasArgObj = typeof argObj !== "undefined";
  if (hasArgObj) {
    argObj.path = this.path;
    argObj.content = this.content;
  }
  
  // This function should modify the object passed into it
  func(hasArgObj ? argObj : newTaskTarget);

  if (hasArgObj) {
    newTaskTarget.content = argObj.content;
  }

  return newTaskTarget;
}

/*
 * Output the content to directory that is relative to the original path
 *
 * @param {string} argObj.dir Relative directory to output
 * @param {string} argObj.name Name of the output file including the extension
 * @return {TaskTarget} A task target for task chaining
 */
TaskTarget.prototype.output = function (argObj) {
  if (typeof argObj === "undefined") {
    throw new Error("No argument object specified!");
  }

  var dir = argObj.dir,
    name = argObj.name;
  
  if (!dir || !name) {
    throw new Error("Invalid directory or file name");
  }
  
  var finalDir = path.resolve(path.dirname(this.path), dir);
  if (!fs.existsSync(finalDir)) {
    fs.mkdir(finalDir);
  }
  fs.writeFileSync(path.resolve(finalDir, name), this.content, "UTF-8");

  return new TaskTarget({
    path: this.path,
    content: this.content
  });
}

// Entry point of the task runner
var TaskRunner = {
  /*
   * Get the content and the path of a file path name and return a task target object for task chaining
   *
   * @param {string} pathName The file path name to get the source
   * @return {TaskTarget} A task target for task chaining
   */
  text: function (pathName) {
    return new TaskTarget({
      path: pathName,
      content: extract.extractUTF8(pathName)
    });
  }
};

module.exports = TaskRunner;