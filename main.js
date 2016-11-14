"use strict";

const log = console.log;
const TaskRunner = require("./deps/task-runner/task-runner");
const inlineImports = require("./deps/utils/inliner").inlineImports;
const stripComments = require("./deps/utils/strip-comments");
const stripNewlines = require("./deps/utils/strip-newlines");

TaskRunner
  .text("./src/index.js")
  .task(inlineImports)
  .task(stripComments)
  .task(stripNewlines)
  .output({
    dir: "../dist",
    name: "ESLSuitejs.dist.js"
  });