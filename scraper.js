const rp = require("request-promise");
const url = "https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&series=15745&display=20&sort=type";

rp(url)
  .then(function(html){
    console.log(html);
  })
  .catch(function(error){
    console.log(error);
  });