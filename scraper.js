const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&display=500&series=15745&sort=type";

rp(url)
  .then(function(html){
      console.log($("tbody > tr > td:not([class]):first-child > a", html).text().split(/(\S{9})/gm));
  })
  .catch(function(error){
    console.log(error);
  });