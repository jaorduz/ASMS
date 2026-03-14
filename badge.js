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

let pages = "";

for(let i=0;i<confirmed.length;i+=2){

const left = buildBadgeHtml_(confirmed[i]);

const right =
confirmed[i+1]
? buildBadgeHtml_(confirmed[i+1])
: "";

pages += `
<div class="page">

<div class="badge">${left}</div>

<div class="badge">${right}</div>

</div>
`;

}

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
function buildBadgeHtml_(record){

const name =
escapeHtml_(record.speakerName + " " + record.speakerLastName);

const institution =
escapeHtml_(record.institution || "");

const topic =
escapeHtml_(record.TopicGral || "");

const social =
record.speakerLinkedin ||
record.speakerWebsite ||
"";

const qr = social
? "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social)
: "";

return `
<div style="text-align:center">

<h3>${CONFIG.EVENT.name}</h3>

<h2>${name}</h2>

<div>${institution}</div>

${qr ? `<img src="${qr}" width="70">` : ""}

<div style="font-size:11px">${topic}</div>

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
size:A4;
margin:10mm;
}

.page{
display:flex;
justify-content:space-between;
margin-bottom:20mm;
}

.badge{
width:90mm;
height:60mm;
border:2px solid #0f3d75;
padding:8mm;
box-sizing:border-box;
}

</style>

</head>

<body>

${pages}

</body>

</html>
`;

}