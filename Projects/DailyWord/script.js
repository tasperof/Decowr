const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXQSJEwW__TCDS9nylubz_tOLy97EFgAbDRp5-sATfi7s4UneqXGwAvDCML9gBaJD08Ftt2hEhsDJ_/pub?gid=508588366&single=true&output=csv";

function dayOfYearIndex(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInMs = date - startOfYear;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(diffInMs / msPerDay);
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    
    
    const dayid = dayOfYearIndex(new Date());
    const rows = csv.trim().split("\n").slice(1)[dayid].split(",");

    const word = rows.slice(1)[0].split('\r')[0];

    let meaning = rows.slice(2,-1).toString();
    if (meaning.includes('"')){
      meaning = meaning.slice(1,-1);
    };

    const pos = rows.slice(-1)[0].split('\r')[0];
    
    document.getElementById("word").textContent = word ;
    document.getElementById("pos").textContent = '(' + pos + ')';
    document.getElementById("meaning").textContent = meaning;
    if(!word || !meaning || !pos){
      throw new Error();
    };
  })
  .catch(err => {
    document.getElementById("word").textContent = "No word found";
    document.getElementById("meaning").textContent = "Interns must've messed up. We're Looking into it.";
    console.error(err);
  });
