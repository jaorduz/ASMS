// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------


// -----------------------------------------------------
// CONFERENCE WEBSITE GENERATOR
// Generates a full conference website from spreadsheet
// -----------------------------------------------------


/* ==============================
PREVIEW (keeps old behavior)
============================== */

function previewConferenceWebsite(){

  const html = buildConferenceWebsite_();

  const output = HtmlService
  .createHtmlOutput(html)
  .setWidth(1200)
  .setHeight(800);

  SpreadsheetApp.getUi()
  .showModalDialog(output,"Conference Website Preview");

}


/* ==============================
OLD SYSTEM (for preview only)
============================== */

function buildConferenceWebsite_(){

  const {records} = getData_();

  return buildConferenceWebsiteWithData_(records, ["Preview Event"]);

}


/* ==============================
NEW SYSTEM (event-driven)
============================== */

function buildSpeakerCards_(records){

  const speakers = records.filter(r =>
    normalizeConfirmationStatus_(r.confirmationStatus)=="Confirmed"
  );

  return speakers.map(r=>{

    const name = escapeHtml_(r.speakerName + " " + r.speakerLastName);
    const topic = escapeHtml_(r.TopicGral);
    const promo = escapeHtml_(r.PromotionalText || "");
    const bio = escapeHtml_(r.speakerBio || "");
    const photo = r.speakerPhoto || "https://via.placeholder.com/300";
    const institution = escapeHtml_(r.institution || "");

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


/* ==============================
WEBSITE BUILDER (FINAL)
============================== */

function buildConferenceWebsiteWithData_(records, registryRow){

  const schedule = buildScheduleHtml_(records);
  const speakers = buildSpeakerCards_(records);

  const eventName = registryRow[0] || "Event";

  return `
<!DOCTYPE html>
<html>

<head>

<title>${eventName}</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

body{
font-family:Arial;
margin:0;
background:#f5f7fb;
}

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
}

.hero{
background:#0f3d75;
color:white;
padding:60px;
text-align:center;
}

.container{
max-width:1200px;
margin:auto;
padding:40px;
}

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

</style>

</head>

<body>

<nav>
<a href="#program">Program</a>
<a href="#speakers">Speakers</a>
</nav>

<div class="hero">
<h1>${eventName}</h1>
</div>

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


/* ==============================
ENTRY POINT (FINAL)
============================== */

function doGet(e){

  const event = e && e.parameter && e.parameter.event;

  if(!event){
    return HtmlService.createHtmlOutput(
      "<h2>No event specified</h2><p>Use ?event=EVENT_NAME</p>"
    );
  }

  const props = PropertiesService.getScriptProperties();
  const registryId = props.getProperty("ASMS_REGISTRY_ID");

  const registry = SpreadsheetApp.openById(registryId);
  const sheet = registry.getSheets()[0];

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const eventIndex = headers.indexOf("eventName");
  const spreadsheetIndex = headers.indexOf("spreadsheetId");

  const row = data.find(r => String(r[eventIndex]).trim() === event);

  if(!row){
    return HtmlService.createHtmlOutput("<h2>Event not found</h2>");
  }

  const spreadsheetId = row[spreadsheetIndex];

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheetEvent = ss.getSheetByName("production");

  const values = sheetEvent.getDataRange().getValues();
  const headersEvent = values.shift();

  const records = values.map((row,i)=>{
    const obj = {};
    headersEvent.forEach((h,j)=>obj[h]=row[j]);
    obj.__rowNumber = i + 2;
    return obj;
  });

  return HtmlService
    .createHtmlOutput(
      buildConferenceWebsiteWithData_(records, row)
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}