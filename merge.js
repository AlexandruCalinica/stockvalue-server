const fs = require("fs");
const eps = require("./eps.json");
const G = require("./netIncomeGrowthRate.json");

function mergeValues(eps, G, length) {
  let result = [];
  for (let i = 0; i < length; i ++) {
    result.push([ 
      eps[i].value ? eps[i].value : 0, 
      G[i].value ? G[i].value : 0 
    ]);
  };
  fs.writeFile("epsG.json", JSON.stringify(result), "utf8", () => console.log("Write successfull!"));
}

mergeValues(eps, G, eps.length);