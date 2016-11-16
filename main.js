"use strict";

const log = console.log;
const TaskRunner = require("./deps/task-runner");
const inlineImports = require("./deps/inline-imports");
const stripComments = require("./deps/strip-comments");
const stripNewlines = require("./deps/strip-newlines");

TaskRunner
  .text("./src/index.js")
  .task(inlineImports)
  .task(stripComments)
  .task(stripNewlines)
  .output({
    dir: "../dist",
    name: "ESLSuitejs.dist.js"
  });