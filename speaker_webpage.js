// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------



// -----------------------------------------------------
// SPEAKER WEBPAGE GENERATOR
// Builds a mini conference website from the spreadsheet
// -----------------------------------------------------


/**
 * Builds the HTML webpage displaying confirmed speakers.
 * This page can be deployed as a web app or previewed inside Sheets.
 */
function buildSpeakerWebpageHtml_(){

const {records} = getData_();


// ---------------------------------------------
// Filter only confirmed speakers
// ---------------------------------------------
const speakers = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) == "Confirmed"
);


// ---------------------------------------------
// Generate speaker cards
// ---------------------------------------------
const cards = speakers.map(r=>{

const name = escapeHtml_(`${r.speakerName} ${r.speakerLastName}`);

const photo = r.speakerPhoto || "https://via.placeholder.com/300";

const bio = escapeHtml_(r.speakerBio || "");

const topic = escapeHtml_(r.TopicGral || "");

const date = formatDateForDisplay_(r.DateTalk);

const time = formatTimeForDisplay_(r.TimeStartTalk);

const institution = escapeHtml_(r.institution || "");


return `

<div class="speaker-card">

<img src="${encodeURI(photo)}" class="speaker-photo">

<h3>${name}</h3>

<div class="speaker-inst">${institution}</div>

<div class="talk-title">${topic}</div>

<div class="talk-time">${date} • ${time}</div>

<p class="speaker-bio">${bio}</p>

</div>

`;

}).join("");


// ---------------------------------------------
// Build webpage HTML
// ---------------------------------------------
return `

<!DOCTYPE html>

<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${CONFIG.EVENT.webpageTitle}</title>

<style>

body{
font-family:Arial;
margin:0;
background:#f5f7fb;
}

.hero{
background:#0f3d75;
color:white;
padding:60px;
text-align:center;
}

.hero h1{
margin:0;
font-size:36px;
}

.container{
max-width:1200px;
margin:auto;
padding:30px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
gap:25px;
}

.speaker-card{
background:white;
border-radius:12px;
padding:20px;
box-shadow:0 6px 20px rgba(0,0,0,.08);
}

.speaker-photo{
width:100%;
height:260px;
object-fit:cover;
border-radius:8px;
}

.speaker-card h3{
margin:12px 0 4px;
}

.speaker-inst{
color:#666;
font-size:14px;
margin-bottom:10px;
}

.talk-title{
font-weight:bold;
color:#0f3d75;
margin-bottom:6px;
}

.talk-time{
font-size:14px;
color:#444;
margin-bottom:10px;
}

.speaker-bio{
font-size:14px;
line-height:1.6;
}

</style>

</head>

<body>

<div class="hero">

<h1>${CONFIG.EVENT.name}</h1>

<p>International Speaker Series</p>

</div>

<div class="container">

<div class="grid">

${cards}

</div>

</div>

</body>

</html>

`;
}



/**
 * Web App entry point
 * Allows this script to be deployed as a public webpage.
 */
function doGet() {

return HtmlService
.createHtmlOutput(buildSpeakerWebpageHtml_())
.setTitle(CONFIG.EVENT.webpageTitle)
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}






/**
 * Opens a preview of the speaker webpage inside Google Sheets.
 */
function previewSpeakerWebpage() {

const html = buildSpeakerWebpageHtml_();

const output = HtmlService
.createHtmlOutput(html)
.setWidth(1100)
.setHeight(750);

SpreadsheetApp
.getUi()
.showModalDialog(output, "Speaker Webpage Preview");

}



/*======== */

function getEventFolder_(){

const registryId = PropertiesService
.getScriptProperties()
.getProperty("ASMS_REGISTRY_ID");

const activeEventId = PropertiesService
.getScriptProperties()
.getProperty("ASMS_ACTIVE_EVENT_ID");

if(!registryId || !activeEventId){
throw new Error("No active ASMS event selected.");
}

const registry = SpreadsheetApp.openById(registryId);
const sheet = registry.getSheets()[0];

const rows = sheet.getDataRange().getValues();
rows.shift();

const row = rows.find(r => r[1] === activeEventId);

if(!row){
throw new Error("Active event not found in registry.");
}

const folderId = row[3];

return DriveApp.getFolderById(folderId);

}