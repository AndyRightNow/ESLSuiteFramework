"use strict";

const exec = require("child_process").exec;

/**
 * Run exec function and return a promise for its results
 *
 * @param {string} cmd A string of commands (connected by "&&" if more than one)
 * @return {Promise} A promise that takes the stdout as the resolve param and err as the reject and catch param
 **/
function _execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      }
      else resolve(stdout);
    });
  });
}

/**
 * Concatenate multiple commands with "&&" and return a string
 *
 * @param {string} cmds Multiple commands you want to concatenate. Separated by commas
 * @return {string} A concatenated command
 **/
function _concatCommands(cmds) {
  var err = new Error("Invalid commands");

  var ret = arguments[0];
  if (!ret || typeof ret !== "string") throw err;
  
  for (let i = 1, ll = arguments.length; i < ll; i++) {
    if (typeof arguments[i] !== "string") {
      throw err;
    }
    ret += `&& ${arguments[i]}`;
  }
  return ret;
}

/**
 * Run a string of commands and return the promise representing the results of the stdout or error message of
 * the commands
 *
 * @param {string} cmd A string of commands (connected by "&&" if more than one)
 * @return {Promise} A promise that takes the stdout as the resolve param and err as the reject and catch param
 **/
function run(cmds) {
  var cmds = _concatCommands.apply(null, arguments);
  return _execPromise(cmds);
}

module.exports = {
  run: run
};