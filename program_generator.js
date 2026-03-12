// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------



// -----------------------------------------------------
// PROGRAM BOOKLET GENERATOR
// Generates an HTML program listing all confirmed talks
// -----------------------------------------------------



function generateProgramBooklet(){

const {records} = getData_();


// -----------------------------------------------------
// Filter confirmed speakers
// -----------------------------------------------------
const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) == "Confirmed"
);



// -----------------------------------------------------
// Sort by date and time
// -----------------------------------------------------
confirmed.sort((a,b)=>{

const d1 = parseDateTime_(a.DateTalk,a.TimeStartTalk);
const d2 = parseDateTime_(b.DateTalk,b.TimeStartTalk);

return d1 - d2;

});



// -----------------------------------------------------
// Build program content
// -----------------------------------------------------
let talksHtml = "";

confirmed.forEach(r=>{

const name =
escapeHtml_(r.speakerName + " " + r.speakerLastName);

const topic =
escapeHtml_(r.TopicGral);

const institution =
escapeHtml_(r.institution || "");

const bio =
escapeHtml_(r.speakerBio || "");

const date =
formatDateForDisplay_(r.DateTalk);

const time =
formatTimeForDisplay_(r.TimeStartTalk);


talksHtml += `

<div class="talk">

<h3>${topic}</h3>

<p class="meta">

<strong>Speaker:</strong> ${name}<br>

<strong>Institution:</strong> ${institution}<br>

<strong>Date:</strong> ${date}<br>

<strong>Time:</strong> ${time}

</p>

<p class="bio">
${bio}
</p>

</div>

`;

});



// -----------------------------------------------------
// Full HTML document
// -----------------------------------------------------
const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>${CONFIG.EVENT.name} Program</title>

<style>

body{
font-family:Arial;
margin:40px;
background:#ffffff;
}

h1{
color:#0f3d75;
}

h2{
margin-top:0;
color:#444;
}

.talk{
margin-bottom:30px;
padding-bottom:20px;
border-bottom:1px solid #ddd;
}

.meta{
font-size:14px;
color:#444;
}

.bio{
font-size:14px;
margin-top:10px;
line-height:1.6;
}

</style>

</head>

<body>

<h1>${CONFIG.EVENT.name}</h1>

<h2>Program</h2>

${talksHtml}

</body>

</html>

`;



// -----------------------------------------------------
// Save file in Google Drive
// -----------------------------------------------------
DriveApp.createFile(
"program.html",
html,
MimeType.HTML
);

}