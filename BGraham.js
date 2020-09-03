const fs = require("fs");
const data = require("./epsG.json");

const yield = 4.1;

function bGraham(eps, G, Y) {
  return parseFloat((((eps * (8.5 + 2 * G)) / 4.4) / Y).toFixed(2));
}

function compute(arr) {
  let res = arr.map((item) => [ ...item, bGraham(item[0], item[1] * 100, yield)]);
  fs.writeFile("bGrahamResult.json", JSON.stringify(res), "utf8", () => console.log("write successful!"));
}

compute(data);