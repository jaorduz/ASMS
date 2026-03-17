// -----------------------------------------------------
// BADGE GENERATOR
// Creates A7 badges and A4 badge sheets
// -----------------------------------------------------

/**
 * Generate a single badge PDF (A7)
 */
function generateBadge(record){

const name =
formatValue_(record.speakerName) + " " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");

const topic =
formatValue_(record.TopicGral || "");

const social =
record.speakerWebsite ||
record.speakerLinkedin ||
"";

let qrHtml = "";

if(social){

const qr =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social);

qrHtml = `<img src="${qr}" width="90" style="margin-top:8px">`;

}

const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;font-family:Arial">

<div style="
width:74mm;
height:105mm;
border:3px solid #0f3d75;
border-radius:10px;
padding:10mm;
box-sizing:border-box;
text-align:center;
display:flex;
flex-direction:column;
justify-content:space-between;
">

<div>
<h3 style="margin:0;color:#0f3d75">
${CONFIG.EVENT.name}
</h3>
</div>

<div>
<h2 style="margin:8px 0">
${escapeHtml_(name)}
</h2>

${institution ? `
<div style="font-size:12px;color:#555">
${escapeHtml_(institution)}
</div>
` : ""}

<div style="font-size:11px;margin-top:6px">
${escapeHtml_(topic)}
</div>

</div>

<div>
${qrHtml}
</div>

</div>

</body>
</html>
`;

const eventFolder = getEventFolder_();

let badgesFolder;

const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}

const filename =
"badge_" + sanitizeFilename_(name) + ".pdf";

const blob =
Utilities.newBlob(html,"text/html",filename)
.getAs("application/pdf");

const file =
badgesFolder.createFile(blob).setName(filename);

return file;

}



/**
 * Generate printable A4 sheets (2 badges per page)
 */
function generateBadgeSheets(){

const {records} = getData_();

const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) == "Confirmed"
);

if(!confirmed.length){
SpreadsheetApp.getUi().alert("No confirmed speakers.");
return;
}

// let pages = "";

// for(let i=0;i<confirmed.length;i+=4){

// const b1 = confirmed[i]   ? buildBadgeFront_(confirmed[i])   : "";
// const b2 = confirmed[i+1] ? buildBadgeFront_(confirmed[i+1]) : "";
// const b3 = confirmed[i+2] ? buildBadgeFront_(confirmed[i+2]) : "";
// const b4 = confirmed[i+3] ? buildBadgeFront_(confirmed[i+3]) : "";

// pages += `
// <div class="page">
//   <div class="badge">${b1}</div>
//   <div class="badge">${b2}</div>
//   <div class="badge">${b3}</div>
//   <div class="badge">${b4}</div>
// </div>
// `;
// }

// /*======*/
// let backPages = "";

// for(let i=0;i<confirmed.length;i+=4){

// const b1 = confirmed[i]   ? buildBadgeBack_(confirmed[i])   : "";
// const b2 = confirmed[i+1] ? buildBadgeBack_(confirmed[i+1]) : "";
// const b3 = confirmed[i+2] ? buildBadgeBack_(confirmed[i+2]) : "";
// const b4 = confirmed[i+3] ? buildBadgeBack_(confirmed[i+3]) : "";

// backPages += `
// <div class="page">
//   <div class="badge">${b1}</div>
//   <div class="badge">${b2}</div>
//   <div class="badge">${b3}</div>
//   <div class="badge">${b4}</div>
// </div>
// `;
// }

// pages += backPages;

let pages = "";

for(let i=0;i<confirmed.length;i+=4){

const b1 = confirmed[i]   ? buildBadgeFront_(confirmed[i])   : "";
const b2 = confirmed[i+1] ? buildBadgeFront_(confirmed[i+1]) : "";
const b3 = confirmed[i+2] ? buildBadgeFront_(confirmed[i+2]) : "";
const b4 = confirmed[i+3] ? buildBadgeFront_(confirmed[i+3]) : "";

pages += `
<div class="page">
  <div class="badge">${b1}</div>
  <div class="badge">${b2}</div>
  <div class="badge">${b3}</div>
  <div class="badge">${b4}</div>
</div>
`;
}

/*======*/
let backPages = "";

for(let i=0;i<confirmed.length;i+=4){

const b1 = confirmed[i]   ? buildBadgeBack_(confirmed[i])   : "";
const b2 = confirmed[i+1] ? buildBadgeBack_(confirmed[i+1]) : "";
const b3 = confirmed[i+2] ? buildBadgeBack_(confirmed[i+2]) : "";
const b4 = confirmed[i+3] ? buildBadgeBack_(confirmed[i+3]) : "";

backPages += `
<div class="page">
  <div class="badge">${b1}</div>
  <div class="badge">${b2}</div>
  <div class="badge">${b3}</div>
  <div class="badge">${b4}</div>
</div>
`;
}

pages += backPages;

/*============================*/

const html = buildBadgeDocument_(pages);

const eventFolder = getEventFolder_();

let badgesFolder;

const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}

const blob =
Utilities.newBlob(html,"text/html","badge_sheet.html")
.getAs("application/pdf");

badgesFolder.createFile(blob)
.setName(CONFIG.EVENT.name + "_badge_sheets.pdf");

SpreadsheetApp.getUi().alert("Badge sheets generated.");

}



/**
 * Badge layout used inside sheets
 */
function buildBadgeFront_(record){

const name =
escapeHtml_(record.speakerName + " " + record.speakerLastName);

const institution =
escapeHtml_(record.institution || "");

return `
<div style="text-align:center">

<h3 style="margin:0;color:#0f3d75">
${CONFIG.EVENT.name}
</h3>

<h2 style="margin:10px 0">
${name}
</h2>

${institution ? `
<div style="font-size:14px;color:#555">
${institution}
</div>
` : ""}

<div style="margin-top:12px;font-weight:bold">
Speaker
</div>

</div>
`;

}

/**====== back */
function buildBadgeBack_(record){

const topic =
escapeHtml_(record.TopicGral || "");

const social =
record.speakerLinkedin ||
record.speakerWebsite ||
"";

let qr = "";

if(social){

qr =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social);

}

return `
<div style="text-align:center">

<h3 style="margin:0;color:#0f3d75">
${CONFIG.EVENT.name}
</h3>

${qr ? `<img src="${qr}" width="90" style="margin-top:10px">` : ""}

<div style="font-size:12px;margin-top:10px">
${topic}
</div>

</div>
`;

}

/**
 * A4 page layout
 */
function buildBadgeDocument_(pages){

return `
<!DOCTYPE html>
<html>

<head>

<style>

@page{
size:A4 landscape;
margin:4mm;
}

body{
margin:0;
font-family:Arial;
}

.page{
display:grid;
grid-template-columns:1fr 1fr;
grid-template-rows:1fr 1fr;
gap:5mm;
width:100%;
height:100%;
page-break-after:always;
}

.badge{
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width:100%;
height:95mm;   /* key fix */
border:1.5px solid #0f3d75;
padding:4mm;
box-sizing:border-box;
text-align:center;
}

</style>

</head>

<body>

${pages}



</body>

</html>
`;

}