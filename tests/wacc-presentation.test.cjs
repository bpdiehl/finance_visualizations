const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src/wacc/app.js"), "utf8"), context);
const P = context.DemoPresentation;

test("input percentages keep two decimal places across whole/tenth values", () => {
  assert.equal(P.percent(0.27), "27.00%");
  assert.equal(P.percent(0.271), "27.10%");
  assert.equal(P.percent(0.27).length, P.percent(0.271).length);
  assert.equal(P.inputValue(0.27), "27.00");
  assert.equal(P.inputValue(0.271), "27.10");
  assert.equal(P.percent(0), "0.00%");
  assert.equal(P.percent(1), "100.00%");
});

test("computed rates and percentage-point changes keep three decimal places", () => {
  assert.equal(P.percent(0.09525, 3), "9.525%");
  assert.equal(P.percent(0.099, 3), "9.900%");
  assert.equal(P.percent(0.12, 3), "12.000%");
  assert.equal(P.points(0.00375), "0.375 pp");
  assert.equal(P.points(0), "0.000 pp");
});

test("display formatting does not mutate or reduce calculation precision", () => {
  const raw = 0.0951675;
  assert.equal(P.percent(raw, 3), "9.517%");
  assert.equal(raw, 0.0951675);
  assert.equal(P.money(30), "$30.00");
  assert.equal(P.money(30.1), "$30.10");
  assert.equal(P.percent(NaN), "—");
  assert.equal(P.percent(Infinity), "—");
});
