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
escapeHtml_(formatValue_(getField_(r,"TopicGral")));

const promo =
escapeHtml_(formatValue_(getField_(r,"PromotionalText")));

const bio = 
escapeHtml_(formatValue_(getField_(r,"speakerBio")));

const photo =
r.speakerPhoto || "https://via.placeholder.com/300";

const institution =
escapeHtml_(formatValue_(getField_(r,"institution")))

const time = 
formatTimeForDisplay_(getField_(r,"TimeStartTalk"));


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



/**
 * Build conference website HTML
 */
function buildConferenceWebsite_(){

const schedule = buildScheduleHtml_();
const speakers = buildSpeakerCards_();

const calendarUrl =
ScriptApp.getService().getUrl() + "?calendar=full";

const sponsorLogosHtml = (CONFIG.SPONSORS || []).map(s => `
  <a href="${s.url}" target="_blank" style="display:inline-block;margin:10px 16px;">
    <img src="${s.logo}" alt="${s.name}" style="height:60px;max-width:160px;object-fit:contain;background:white;padding:6px;border-radius:8px;">
  </a>
`).join("");

const applicationFormUrl =
  PropertiesService.getScriptProperties()
  .getProperty("ASMS_EVENT_APPLICATION_FORM_URL") || "";

const applicationButtonHtml = applicationFormUrl ? `
<p style="text-align:center;margin:20px 0;">
  <a href="${applicationFormUrl}"
     target="_blank"
     style="
       background:#2c7be5;
       color:white;
       padding:14px 22px;
       border-radius:8px;
       text-decoration:none;
       font-weight:bold;
       font-size:16px;
     ">
    Sube tu aplicación
  </a>
</p>
` : "";

return `
<!DOCTYPE html>

<html>

<head>

<title>${CONFIG.EVENT.name}</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

/* (ALL YOUR CSS — unchanged) */

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

<!-- Application -->
${applicationButtonHtml}

<!-- CONTENT -->

<div class="container">

<h2>Program</h2>

<strong>Calendar Download</strong><br>
You can download the full conference schedule and add it to your calendar.

<p style="margin-bottom:20px;font-size:14px;">

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

<div class="footer">
  <h3>Partners and Sponsors</h3>
  <div class="footer-logos">
    ${sponsorLogosHtml}
  </div>
</div>

</body>

</html>
`;
}



/**
 * Entry point for deployed website
 */
function doGet(e){

if(e && e.parameter.calendar){

/* FULL CONFERENCE CALENDAR */
if(e.parameter.calendar === "full"){

const blob = generateConferenceCalendar_();

return ContentService
.createTextOutput(blob.getDataAsString())
.setMimeType(ContentService.MimeType.ICAL);

}

/* SINGLE SESSION */
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

/******/
function debugApplicationFormUrl_(){
  const url = PropertiesService.getScriptProperties()
    .getProperty("ASMS_EVENT_APPLICATION_FORM_URL") || "";
  SpreadsheetApp.getUi().alert("Application URL:\n\n" + (url || "[EMPTY]"));
}