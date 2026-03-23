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

const promo =
escapeHtml_(r.PromotionalText || "");

const bio =
escapeHtml_(r.speakerBio || "");

const photo =
r.speakerPhoto || "https://via.placeholder.com/300";

const institution =
escapeHtml_(r.institution || "");

return `

<div class="speaker-card">

<img src="${photo}" style="
width:100%;
height:220px;
object-fit:cover;
border-radius:8px">

<h3>${name}</h3>

<div style="color:#666;font-size:14px;margin-bottom:6px">
${institution}
</div>

<div style="font-weight:bold;color:#0f3d75">
${topic}
</div>

<div style="
margin-top:10px;
padding:12px;
background:#f5f7fb;
border-left:4px solid #0f3d75;
font-size:14px;
line-height:1.6;
">
${promo}
</div>

<p style="font-size:14px;margin-top:10px">
${bio}
</p>

</div>
`;

}).join("");

}

/*===================*/
function getActiveEventApplicationFormUrl_(){

  const props = PropertiesService.getScriptProperties();

  const registryId = props.getProperty("ASMS_REGISTRY_ID");
  const activeEventId = props.getProperty("ASMS_ACTIVE_EVENT_ID");

  if(!registryId || !activeEventId){
    return "";
  }

  const registry = SpreadsheetApp.openById(registryId);
  const sheet = registry.getSheets()[0];

  const data = sheet.getDataRange().getValues();

  if(data.length < 2){
    return "";
  }

  const headers = data[0];
  const rows = data.slice(1);

  const colEvent = headers.indexOf("spreadsheetId");
  const colApp = headers.indexOf("applicationFormUrl");

  if(colEvent === -1 || colApp === -1){
    return "";
  }

  const row = rows.find(r => String(r[colEvent]) === String(activeEventId));

  return row ? String(row[colApp] || "").trim() : "";
}
/*==================*/

/**
 * Build conference website HTML
 */
function buildConferenceWebsite_(){

const schedule = buildScheduleHtml_();
const speakers = buildSpeakerCards_();


/*To Apply*/
const applicationFormUrl = getActiveEventApplicationFormUrl_();
const applyButtonHtml = applicationFormUrl
? `<a href="${applicationFormUrl}" target="_blank" class="apply-button">Apply to Event</a>`
: "";

/*====================*/
const eventFolder = getEventFolder_();

let programFolder;

const folders = eventFolder.getFoldersByName("program");

if (folders.hasNext()){
programFolder = folders.next();
}else{
programFolder = eventFolder.createFolder("program");
}

const calendarBlob = generateConferenceCalendar_();

// const calendarFile = programFolder.createFile(calendarBlob);
const calendarFile = saveOrUpdateCalendarFile_("skip");

const calendarUrl = calendarFile.getUrl();
/*====================*/

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
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
margin:0;
background:#f4f6f9;
color:#1f2a37;
}

/* Navigation */

nav{
background:#0b2e59;
padding:16px;
text-align:center;
box-shadow:0 2px 6px rgba(0,0,0,0.08);
}

nav a{
color:#ffffff;
margin:0 18px;
text-decoration:none;
font-weight:600;
font-size:15px;
letter-spacing:0.3px;
}

nav a:hover{
text-decoration:underline;
}

/* Apply Button */

.apply-button{
display:inline-block;
background:#1f4e8c;
color:white;
padding:8px 16px;
border-radius:8px;
text-decoration:none;
font-weight:600;
font-size:14px;
margin-left:18px;
transition:all 0.2s ease;
}

.apply-button:hover{
background:#163b6d;
}

/* Hero */

.hero{
background:linear-gradient(135deg,#0b2e59,#1f4e8c);
color:white;
padding:70px 20px;
text-align:center;
}

.hero h1{
margin:0;
font-size:40px;
font-weight:700;
letter-spacing:0.5px;
}

.hero p{
margin-top:10px;
font-size:16px;
opacity:0.9;
}

/* Intro section */

.intro-section{
max-width:900px;
margin:50px auto 30px auto;
padding:24px;
text-align:justify;
font-size:16px;
line-height:1.75;
color:#2c3e50;
background:#ffffff;
border-radius:12px;
box-shadow:0 6px 18px rgba(0,0,0,0.06);
}

/* Container */

.container{
max-width:1200px;
margin:auto;
padding:40px;
}

/* Headings */

h2{
color:#0b2e59;
margin-bottom:20px;
font-weight:700;
}

/* Schedule Table */

.schedule{
width:100%;
border-collapse:collapse;
margin-bottom:40px;
background:white;
border-radius:10px;
overflow:hidden;
box-shadow:0 4px 12px rgba(0,0,0,0.05);
}

.schedule th{
background:#0b2e59;
color:white;
padding:12px;
text-align:left;
font-weight:600;
}

.schedule td{
padding:12px;
border-bottom:1px solid #e5e7eb;
font-size:14px;
vertical-align:top;
}

.schedule tr:hover{
background:#f8fafc;
}

.schedule th:nth-child(4),
.schedule td:nth-child(4){
text-align:center;
white-space:nowrap;
width:140px;
}

/* Zoom button */

.zoom-link{
display:inline-block;
background:#2563eb;
color:white;
padding:6px 12px;
border-radius:6px;
text-decoration:none;
font-size:13px;
font-weight:600;
transition:all 0.2s ease;
}

.zoom-link:hover{
background:#1e40af;
}

/* Speaker grid */

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:25px;
}

/* Speaker card */

.speaker-card{
background:white;
border-radius:14px;
padding:18px;
box-shadow:0 8px 24px rgba(0,0,0,.06);
transition:transform 0.2s ease, box-shadow 0.2s ease;
}

.speaker-card:hover{
transform:translateY(-4px);
box-shadow:0 12px 30px rgba(0,0,0,.08);
}

.speaker-card h3{
margin-top:12px;
font-size:18px;
color:#0b2e59;
}

.speaker-card img{
border-radius:10px;
}

.speaker-card p{
color:#4b5563;
}

/* Sponsors */

.sponsors{
margin-top:60px;
padding:40px 20px;
text-align:center;
background:#ffffff;
border-top:1px solid #e5e7eb;
}

.sponsors h3{
color:#0b2e59;
margin-bottom:20px;
font-weight:700;
}

.sponsors img{
height:60px;
margin:10px;
object-fit:contain;
filter:grayscale(20%);
opacity:0.9;
transition:all 0.2s ease;
}

.sponsors img:hover{
filter:none;
opacity:1;
}

/* Responsive */

@media (max-width: 768px){

.hero h1{
font-size:28px;
}

.container{
padding:20px;
}

.intro-section{
text-align:left;
}

}

</style>

</head>

<body>

<!-- NAVIGATION -->

<nav>

<a href="#home">Home</a>
<a href="#program">Program</a>
<a href="#speakers">Speakers</a>

${applyButtonHtml}

</nav>


<!-- HERO -->

<div class="hero" id="home">

<h1>${CONFIG.EVENT.name}</h1>

<p>International Research Bootcamp</p>

</div>


<!-- paragraph -->


<div class="intro-section" style="
max-width:900px;
margin:40px auto 20px auto;
padding:20px;
text-align:justify;
font-size:16px;
line-height:1.7;
color:#333;
background:#ffffff;
border-radius:10px;
box-shadow:0 4px 12px rgba(0,0,0,0.05);
">

<p>
The Research Accelerator Bootcamp (RAB) empowers researchers to design 
competitive funding proposals through a practical, collaborative, and 
bilingual (Spanish–English) program. Participants gain direct insight 
from national and international experts on evaluation standards, proposal 
strategies, and funding opportunities, while building interdisciplinary 
networks. RAB is designed to strengthen research capacity, foster collaboration, 
and support the development of high-impact scientific projects aligned with national 
and global priorities.
</p>

</div>


<!-- CONTENT -->

<div class="container">

<h2>Program</h2>

<p style="
margin-bottom:20px;
font-size:14px;
">

<a href="${calendarUrl}" target="_blank"
style="
background:#0f3d75;
color:white;
padding:10px 16px;
border-radius:6px;
text-decoration:none;
font-weight:bold;
">
Download Conference Calendar (.ics)
</a>

</p>

${schedule}


<h2 id="speakers">Speakers</h2>

<div class="grid">

${speakers}

</div>

</div>
${buildSponsorsSection_()}

<script>
function openExternalLink(url){
  try{
    window.top.location.href = url;
  }catch(e){
    window.open(url,'_blank');
  }
}
</script>




</body>

</html>

`;

}



/**
 * Entry point for deployed website
 */
function doGet(e){

if(e && e.parameter.calendar){

const row = parseInt(e.parameter.calendar);

const {records} = getData_();

const record = records.find(r => r.__rowNumber === row);

const ics = buildIcsBlob_(record);

return ContentService
.createTextOutput(ics.getDataAsString())
.setMimeType(ContentService.MimeType.ICAL);

}

return HtmlService
.createHtmlOutput(buildConferenceWebsite_())
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}


// LOGO
function buildSponsorsSection_(){

  const sponsors = CONFIG.SPONSORS || [];

  if(!sponsors.length) return "";

  const logos = sponsors.map(s => `

<a href="${s.url}" target="_blank">
  <img src="${s.logo}" alt="${s.name}" style="
    height:60px;
    margin:10px;
    object-fit:contain;
  ">
</a>

`).join("");

  return `

<div style="
  margin-top:60px;
  padding:30px;
  text-align:center;
  background:#ffffff;
">

<h3 style="color:#0f3d75;margin-bottom:20px">
Sponsors & Partners
</h3>

<div style="
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
">
${logos}
</div>

</div>

`;

}