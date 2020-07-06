const cheerio = require("cheerio");
const got = require("got");
const fs = require("fs");
const filter = "genomic";

const delay = t => new Promise(resolve => setTimeout(resolve, t));

async function getTotalPages() {
  const { body } = await got("https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&series=15745&display=500&zsort=type")
  const totalPage = cheerio("span[id='page_cnt']", body).text();
  return totalPage;
}

async function getPage(id) {
  const serie = [];
  const { body } = await got(`https://www.ncbi.nlm.nih.gov/geo/browse/?view=samples&series=15745&display=500&zsort=type&page=${id}`);
  const $ = cheerio.load(body);
  const totalTableRaw = $("tbody > tr").length;
  for (tableRaw = 1; tableRaw <= totalTableRaw; tableRaw++) {
    if ($(`tbody > tr:nth-child(${tableRaw}) > td:nth-child(3) > a`).text().substring(0, 7) === filter) {
      serie.push($(`tbody > tr:nth-child(${tableRaw}) > td:not([class]):first-child > a`).text().split(/(\S{9})/gm).join(""));
    }
  }
  return serie;
}

async function downloadGSMTextFile(GSMName) {
  const response = await got(`https://www.ncbi.nlm.nih.gov/geo/tools/geometa.cgi?acc=${GSMName}&scope=full&mode=soft`);
  fs.writeFileSync(`./downloads/${GSMName}.txt`, response.body);
  console.log(`${GSMName} saved.`);
}

async function start(){
  const totalPages = await getTotalPages();
  let names = [];
  for(i = 1; i <= totalPages; i++){
    const page = await getPage(i);
    console.log(i);
    names = names.concat(page);
  }
  //Probably will fail
  // names.forEach(name => {
  //   downloadGSMTextFile(name);
  // })
  
  //With await
  // for(j = 0; j < names.length; j++){
  //   console.log(names[j]);
  //   await downloadGSMTextFile(names[j]);
  // }

  for(j = 0; j < names.length; j++){
    downloadGSMTextFile(names[j]);
    await delay(500);
  }
}

start();