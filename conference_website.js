// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------


// -----------------------------------------------------
// CONFERENCE WEBSITE GENERATOR
// Generates a full conference website from spreadsheet
// -----------------------------------------------------

// -----------------------------------------------------
// ASMS - Conference Website (MULTI-EVENT SAFE)
// -----------------------------------------------------


// =========================
// PREVIEW (uses active event)
// =========================
function previewConferenceWebsite(){

  const spreadsheetId = getActiveSpreadsheetId_();
  const html = buildConferenceWebsite_(spreadsheetId);

  const output = HtmlService
    .createHtmlOutput(html)
    .setWidth(1200)
    .setHeight(800);

  SpreadsheetApp.getUi()
    .showModalDialog(output,"Conference Website Preview");
}


// =========================
// DATA ACCESS (LOCAL, NOT GLOBAL)
// =========================
function getDataFromSpreadsheet_(spreadsheetId){

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName("production");

  if(!sheet) throw new Error("Sheet not found");

  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  const records = values.map((row,i)=>{
    const obj = {};
    headers.forEach((h,j)=>obj[h]=row[j]);
    obj.__rowNumber = i + 2;
    return obj;
  });

  return {records};
}


// =========================
// SPEAKERS
// =========================
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


// =========================
// SCHEDULE (LOCAL)
// =========================
function buildScheduleHtmlLocal_(records){

  const confirmed = records.filter(r =>
    normalizeConfirmationStatus_(r.confirmationStatus)=="Confirmed"
  );

  if(!confirmed.length){
    return "<p>No confirmed sessions yet.</p>";
  }

  confirmed.sort((a,b)=>{
    const d1 = parseDateTime_(a.DateTalk,a.TimeStartTalk);
    const d2 = parseDateTime_(b.DateTalk,b.TimeStartTalk);
    return d1 - d2;
  });

  let html = `
<table class="schedule">
<tr>
<th>Time</th>
<th>Speaker</th>
<th>Talk</th>
</tr>
`;

  confirmed.forEach(r=>{

    const time = formatTimeForDisplay_(r.TimeStartTalk);
    const name = escapeHtml_(r.speakerName+" "+r.speakerLastName);
    const topic = escapeHtml_(r.TopicGral);

    html += `
<tr>
<td>${time}</td>
<td>${name}</td>
<td>${topic}</td>
</tr>
`;
  });

  html += "</table>";

  return html;
}


// =========================
// MAIN WEBSITE
// =========================
function buildConferenceWebsite_(spreadsheetId){

  const {records} = getDataFromSpreadsheet_(spreadsheetId);

  const schedule = buildScheduleHtmlLocal_(records);
  const speakers = buildSpeakerCards_(records);

  return `
<!DOCTYPE html>
<html>

<head>
<title>Conference</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

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

.container{
max-width:1200px;
margin:auto;
padding:40px;
}

.schedule{
width:100%;
border-collapse:collapse;
margin-bottom:40px;
}

.schedule th{
background:#0f3d75;
color:white;
padding:10px;
text-align:left;
}

.schedule td{
padding:10px;
border-bottom:1px solid #ddd;
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

<div class="hero">
<h1>Conference Website</h1>
</div>

<div class="container">

<h2>Program</h2>
${schedule}

<h2>Speakers</h2>
<div class="grid">
${speakers}
</div>

</div>

</body>
</html>
`;
}


// =========================
// ENTRY POINT (FINAL FIX)
// =========================
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

  return HtmlService
    .createHtmlOutput(buildConferenceWebsite_(spreadsheetId))
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}