// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------

// -----------------------------------------------------
// CONFERENCE WEBSITE GENERATOR
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
 * Build speaker cards
 */
function buildSpeakerCards_(records){

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

/**
 * Build conference website HTML (legacy preview)
 */
function buildConferenceWebsite_(){

const schedule = "";
const speakers = "";

const applicationFormUrl = getActiveEventApplicationFormUrl_();
const applyButtonHtml = applicationFormUrl
? `<a href="${applicationFormUrl}" target="_blank" class="apply-button">Apply to Event</a>`
: "";

const calendarFile = saveOrUpdateCalendarFile_("skip");
const calendarUrl = calendarFile.getUrl();

return `
<!DOCTYPE html>
<html>
<head>
<title>${CONFIG.EVENT.name}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<nav>
<a href="#home">Home</a>
<a href="#program">Program</a>
<a href="#speakers">Speakers</a>
${applyButtonHtml}
</nav>

<div class="hero" id="home">
<h1>${CONFIG.EVENT.name}</h1>
</div>

<div class="container">

<h2>Program</h2>

<a href="${calendarUrl}" target="_blank">
Download Conference Calendar (.ics)
</a>

${schedule}

<h2 id="speakers">Speakers</h2>

<div class="grid">
${speakers}
</div>

</div>

${buildSponsorsSection_()}

</body>
</html>
`;

}

/**
 * Entry point
 */
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

  if(e && e.parameter.calendar){

    const rowNumber = parseInt(e.parameter.calendar);
    const record = records.find(r => r.__rowNumber === rowNumber);

    const ics = buildIcsBlob_(record);

    return ContentService
      .createTextOutput(ics.getDataAsString())
      .setMimeType(ContentService.MimeType.ICAL);
  }

  return HtmlService
    .createHtmlOutput(
      buildConferenceWebsiteWithData_(records, row)
    )
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

// main website builder
function buildConferenceWebsiteWithData_(records, registryRow){

  const schedule = buildScheduleHtml_(records);
  const speakers = buildSpeakerCards_(records);

  const eventName = registryRow[0];
  const applicationFormUrl = registryRow[5];

  const applyButtonHtml = applicationFormUrl
  ? `<a href="${applicationFormUrl}" target="_blank" class="apply-button">Apply to Event</a>`
  : "";

  const calendarFile = saveOrUpdateCalendarFile_("skip");
  const calendarUrl = calendarFile.getUrl();

  return `
<!DOCTYPE html>
<html>

<head>
<title>${eventName}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

<nav>
<a href="#home">Home</a>
<a href="#program">Program</a>
<a href="#speakers">Speakers</a>
${applyButtonHtml}
</nav>

<div class="hero" id="home">
<h1>${eventName}</h1>
<p>International Research Bootcamp</p>
</div>

<div class="container">

<h2>Program</h2>

<a href="${calendarUrl}" target="_blank">
Download Conference Calendar (.ics)
</a>

${schedule}

<h2 id="speakers">Speakers</h2>

<div class="grid">
${speakers}
</div>

</div>

${buildSponsorsSection_()}

</body>

</html>
`;

}