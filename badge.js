// -----------------------------------------------------
// BADGE GENERATOR
// Creates speaker badges as PDF with optional QR
// -----------------------------------------------------

function generateBadge(record){

const name =
formatValue_(record.speakerName) + " " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");


// ---------------------------------------------
// Determine link for QR
// priority: speaker website → LinkedIn → none
// ---------------------------------------------
const link =
record.speakerWebsite ||
record.speakerLinkedin ||
"";

let qrHtml = "";

if(link){

const qr =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(link);

qrHtml = `
<img src="${qr}" width="110" style="margin-top:12px">
<div style="font-size:11px;color:#666;margin-top:4px">
Scan for profile
</div>
`;

}


// ---------------------------------------------
// Badge HTML layout
// ---------------------------------------------
const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="
font-family:Arial;
background:#ffffff;
padding:10px">

<div style="
width:300px;
border:3px solid #0f3d75;
border-radius:12px;
padding:20px;
text-align:center">

<h3 style="
margin-top:0;
color:#0f3d75">
${CONFIG.EVENT.name}
</h3>

<h2 style="
margin:12px 0 6px 0;
font-size:22px">
${escapeHtml_(name)}
</h2>

${institution ? `
<div style="
font-size:14px;
color:#444;
margin-bottom:10px">
${escapeHtml_(institution)}
</div>
` : ""}

<div style="
font-size:13px;
color:#666">
Speaker
</div>

${qrHtml}

</div>

</body>
</html>
`;


// ---------------------------------------------
// Locate event folder
// ---------------------------------------------
const eventFolder = getEventFolder_();

let badgesFolder;

const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}


// ---------------------------------------------
// Create PDF badge
// ---------------------------------------------
const filename =
"badge_" + sanitizeFilename_(name) + ".pdf";

const htmlOutput = HtmlService.createHtmlOutput(html);

const blob =
Utilities.newBlob(
htmlOutput.getContent(),
"text/html",
filename
).getAs("application/pdf");

const file =
badgesFolder.createFile(blob);

file.setName(filename);

return file;

}