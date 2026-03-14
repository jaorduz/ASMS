function generateBadgeSheets(){

const {records} = getData_();

const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) == "Confirmed"
);

if(!confirmed.length){
SpreadsheetApp.getUi().alert("No confirmed speakers.");
return;
}

const eventFolder = getEventFolder_();

let badgesFolder;
const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}


/* ---------------------------
Build badge HTML
--------------------------- */

let front = "";
let back = "";

confirmed.forEach(r=>{

const name =
escapeHtml_(formatValue_(r.speakerName) + " " + formatValue_(r.speakerLastName));

const institution =
escapeHtml_(formatValue_(r.institution || ""));

const topic =
escapeHtml_(formatValue_(r.TopicGral));

const social =
r.speakerLinkedin ||
r.speakerWebsite ||
"";

const qr =
social ?
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social)
: "";



front += `
<div class="badge">
<h2>${name}</h2>
<div class="inst">${institution}</div>
<div class="event">${CONFIG.EVENT.name}</div>
</div>
`;



back += `
<div class="badge">
${qr ? `<img src="${qr}" class="qr">` : ""}
<div class="topic">${topic}</div>
</div>
`;

});


/* ---------------------------
A4 Landscape Layout
--------------------------- */

const html = `
<!DOCTYPE html>
<html>
<head>

<style>

@page {
size:A4 landscape;
margin:15mm;
}

body{
font-family:Arial;
}

.page{
display:grid;
grid-template-columns:1fr 1fr;
gap:10mm;
page-break-after:always;
}

.badge{
width:100%;
height:90mm;
border:2px solid #0f3d75;
border-radius:10px;
padding:20px;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
text-align:center;
}

.badge h2{
margin:0;
font-size:28px;
}

.inst{
font-size:16px;
color:#555;
margin-top:5px;
}

.event{
margin-top:10px;
font-size:14px;
color:#0f3d75;
}

.qr{
width:120px;
margin-bottom:10px;
}

.topic{
font-size:16px;
font-weight:bold;
}

</style>

</head>

<body>

<div class="page">
${front}
</div>

<div class="page">
${back}
</div>

</body>
</html>
`;


/* ---------------------------
Save PDF
--------------------------- */

const blob = Utilities.newBlob(html,"text/html","badges.html");

const file = badgesFolder.createFile(blob).getAs("application/pdf");

file.setName("badge_sheets.pdf");

SpreadsheetApp.getUi().alert("Badge sheets generated.");

}