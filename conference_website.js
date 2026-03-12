// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------


// -----------------------------------------------------
// CONFERENCE WEBSITE GENERATOR
// Generates a full conference website from spreadsheet
// -----------------------------------------------------


/**
 * Preview website inside Google Sheets
 */
function previewConferenceWebsite(){

const html = buildConferenceWebsite_();

const output = HtmlService
.createHtmlOutput(html)
.setWidth(1200)
.setHeight(800);

SpreadsheetApp.getUi()
.showModalDialog(output,"Conference Website Preview");

}



/**
 * Build speaker cards from spreadsheet
 */
function buildSpeakerCards_(){

const {records} = getData_();

const speakers = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus)=="Confirmed"
);

return speakers.map(r=>{

const name =
escapeHtml_(r.speakerName + " " + r.speakerLastName);

const topic =
escapeHtml_(r.TopicGral);

const bio =
escapeHtml_(r.speakerBio || "");

const photo =
r.speakerPhoto || "https://via.placeholder.com/300";

const institution =
escapeHtml_(r.institution || "");

return `

<div class="speaker-card">

<img src="${photo}" class="speaker-photo">

<h3>${name}</h3>

<div class="speaker-inst">
${institution}
</div>

<div class="talk-title">
${topic}
</div>

<p class="speaker-bio">
${bio}
</p>

</div>

`;

}).join("");

}



/**
 * Build conference website HTML
 */
function buildConferenceWebsite_(){

const schedule = buildScheduleHtml_();
const speakers = buildSpeakerCards_();

return `
<!DOCTYPE html>

<html>

<head>

<title>${CONFIG.EVENT.name}</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

html{
scroll-behavior:smooth;
}

body{
font-family:Arial;
margin:0;
background:#f5f7fb;
}

/* Navigation */

nav{
background:#0f3d75;
padding:14px;
text-align:center;
}

nav a{
color:white;
margin:0 18px;
text-decoration:none;
font-weight:bold;
font-size:15px;
}

nav a:hover{
text-decoration:underline;
}

/* Hero */

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

/* Container */

.container{
max-width:1200px;
margin:auto;
padding:40px;
}

/* Schedule */

.schedule{
width:100%;
border-collapse:collapse;
margin-bottom:40px;
}

.schedule th,
.schedule td{
border:1px solid #ddd;
padding:10px;
}

.schedule th{
background:#0f3d75;
color:white;
}

/* Speaker grid */

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:25px;
}

.speaker-card{
background:white;
border-radius:12px;
padding:18px;
box-shadow:0 6px 20px rgba(0,0,0,.08);
}

.speaker-photo{
width:100%;
height:220px;
object-fit:cover;
border-radius:8px;
}

.speaker-inst{
color:#666;
font-size:14px;
margin-bottom:6px;
}

.talk-title{
font-weight:bold;
color:#0f3d75;
margin-bottom:8px;
}

.speaker-bio{
font-size:14px;
line-height:1.6;
}

</style>

</head>

<body>

<!-- NAVIGATION -->

<nav>

<a href="#home">Home</a>
<a href="#program">Program</a>
<a href="#speakers">Speakers</a>

</nav>


<!-- HERO -->

<div class="hero" id="home">

<h1>${CONFIG.EVENT.name}</h1>

<p>International Research Bootcamp</p>

</div>


<!-- CONTENT -->

<div class="container">

<h2 id="program">Program</h2>

${schedule}


<h2 id="speakers">Speakers</h2>

<div class="grid">

${speakers}

</div>

</div>

</body>

</html>

`;

}



/**
 * Entry point for deployed website
 */
function doGet(){

return HtmlService
.createHtmlOutput(buildConferenceWebsite_())
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}