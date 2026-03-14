// -----------------------------------------------------
// BADGE GENERATOR
// Creates A7 PDF badges for speakers
// -----------------------------------------------------

function generateBadge(record){

const name =
formatValue_(record.speakerName) + " " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");

const topic =
formatValue_(record.TopicGral || "");


// -----------------------------------------------------
// Determine QR destination
// -----------------------------------------------------

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


// -----------------------------------------------------
// Badge HTML layout (A7)
// -----------------------------------------------------

const html = `
<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
</head>

<body style="
margin:0;
padding:0;
font-family:Arial;
">

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

<h3 style="
margin:0;
font-size:14px;
color:#0f3d75">
${CONFIG.EVENT.name}
</h3>

</div>


<div>

<h2 style="
margin:8px 0;
font-size:20px">
${escapeHtml_(name)}
</h2>

${institution ? `
<div style="
font-size:12px;
color:#555;
margin-bottom:6px">
${escapeHtml_(institution)}
</div>
` : ""}

<div style="
font-size:11px;
color:#333;
margin-top:4px">
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


// -----------------------------------------------------
// Get event folder
// -----------------------------------------------------

const eventFolder = getEventFolder_();

let badgesFolder;

const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}


// -----------------------------------------------------
// Convert HTML → PDF
// -----------------------------------------------------

const filename =
"badge_" + sanitizeFilename_(name) + ".pdf";

const htmlOutput = HtmlService.createHtmlOutput(html);

const blob = Utilities.newBlob(
htmlOutput.getContent(),
"text/html",
filename
);

const pdf = blob.getAs("application/pdf");

const file = badgesFolder.createFile(pdf).setName(filename);

return file;

}