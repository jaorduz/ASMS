function generateBadge(record){

const name =
formatValue_(record.speakerName) + " " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");

const topic =
formatValue_(record.TopicGral || "");


// ---------------------------------------------
// Determine QR target
// ---------------------------------------------
const social =
record.speakerLinkedin ||
record.speakerWebsite ||
"";


// ---------------------------------------------
// Generate QR if available
// ---------------------------------------------
let qrHTML = "";

if(social){

const qr =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social);

qrHTML = `<img src="${qr}" width="90">`;

}


// ---------------------------------------------
// Badge HTML (A7 format)
// ---------------------------------------------
const html = `
<!DOCTYPE html>
<html>

<head>

<style>

@page{
size:A7;
margin:0;
}

body{
width:74mm;
height:105mm;
margin:0;
font-family:Arial;
}

.badge{
width:74mm;
height:105mm;
box-sizing:border-box;
border:3px solid #0f3d75;
padding:10mm;
display:flex;
flex-direction:column;
align-items:center;
justify-content:space-between;
text-align:center;
}

.event{
font-size:12px;
font-weight:bold;
color:#0f3d75;
}

.name{
font-size:18px;
font-weight:bold;
}

.institution{
font-size:11px;
color:#444;
}

.topic{
font-size:11px;
margin-top:6px;
}

.qr{
margin-top:8px;
}

.role{
font-size:12px;
margin-top:6px;
}

</style>

</head>

<body>

<div class="badge">

<div class="event">
${CONFIG.EVENT.name}
</div>

<div>

<div class="name">
${escapeHtml_(name)}
</div>

${institution ? `<div class="institution">${escapeHtml_(institution)}</div>` : ""}

<div class="role">Speaker</div>

</div>

<div class="topic">
${escapeHtml_(topic)}
</div>

<div class="qr">
${qrHTML}
</div>

</div>

</body>

</html>
`;


// ---------------------------------------------
// Save badge as PDF
// ---------------------------------------------
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

const pdfBlob = Utilities.newBlob(html,"text/html")
.getAs("application/pdf")
.setName(filename);

return badgesFolder.createFile(pdfBlob);

}