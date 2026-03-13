// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------

// -----------------------------------------------------
// BADGE GENERATOR
// Creates speaker badges with QR codes
// -----------------------------------------------------

function generateBadge(record){

const name =
formatValue_(record.speakerName) +
" " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");


// ---------------------------------------------
// Determine social link for QR code
// ---------------------------------------------
const social =
record.speakerLinkedin ||
record.speakerWebsite ||
CONFIG.ORGANIZER.meeting;


// ---------------------------------------------
// QR code generator
// ---------------------------------------------
const qr =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
encodeURIComponent(social);


// ---------------------------------------------
// Badge HTML layout
// ---------------------------------------------
const html = `
<!DOCTYPE html>
<html>

<body style="
font-family:Arial;
background:#f4f6f8;
padding:20px">

<div style="
width:320px;
margin:auto;
border:3px solid #0f3d75;
border-radius:12px;
padding:20px;
background:white;
text-align:center">

<h3 style="margin-top:0;color:#0f3d75">
${CONFIG.EVENT.name}
</h3>

<img src="${qr}" width="120" style="margin:10px 0">

<h2 style="margin:10px 0">
${escapeHtml_(name)}
</h2>

<div style="font-size:14px;color:#555;margin-bottom:6px">
${escapeHtml_(institution)}
</div>

<p style="font-size:14px;margin-top:8px">
Speaker
</p>

</div>

</body>
</html>
`;


// ---------------------------------------------
// Save badge inside event folder
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
"badge_" + sanitizeFilename_(name) + ".html";

const file =
badgesFolder.createFile(
Utilities.newBlob(html,"text/html",filename)
);

return file;

}