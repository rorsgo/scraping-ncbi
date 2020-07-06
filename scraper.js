const rp = require("request-promise");
const $ = require("cheerio");
const { nextTick } = require("process");
const url = `https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&series=15745&display=500&zsort=type&page=1`;
const filter = "genomic";
const serie = [];

rp(url)
  .then(function (html) {
    const totalPage = $("span[id='page_cnt']", html).text();
    for (page = 1; page <= totalPage; page++) {
      var newUrl = `https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&series=15745&display=500&sort=type&page=${page}`
      rp(newUrl)
        .then(function (html) {
          const totalTableRaw = ($("tr", html).length) - 2
          for (tableRaw = 2; tableRaw <= totalTableRaw; tableRaw++) {
            if ($(`tbody > tr:nth-child(${tableRaw}) > td:nth-child(3) > a`, html).text().substring(0, 7) === filter) {
              serie.push($(`tbody > tr:nth-child(${tableRaw}) > td:not([class]):first-child > a`, html).text().split(/(\S{9})/gm).join(""));
              console.log(serie.length)
            } else {
              return
            }
          }
          console.log(serie)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  })
  .catch()

