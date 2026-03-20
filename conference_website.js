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


.apply-button{
display:inline-block;
background:#2c7be5;
color:white;
padding:8px 14px;
border-radius:6px;
text-decoration:none;
font-weight:bold;
font-size:14px;
margin-left:18px;
}

.apply-button:hover{
background:#1a5ed9;
text-decoration:none;
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


.schedule th:nth-child(4),
.schedule td:nth-child(4){
text-align:center;
white-space:nowrap;
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
font-size:14px;
vertical-align:top;
}

.schedule th:nth-child(4),
.schedule td:nth-child(4){
text-align:center;
white-space:nowrap;
width:140px;
}

/* Add here */

.zoom-link{
display:inline-block;
background:#2c7be5;
color:white;
padding:6px 12px;
border-radius:6px;
text-decoration:none;
font-size:13px;
font-weight:bold;
}

.zoom-link:hover{
background:#1a5ed9;
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

${applyButtonHtml}

</nav>


<!-- HERO -->

<div class="hero" id="home">

<h1>${CONFIG.EVENT.name}</h1>

<p>International Research Bootcamp</p>

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

  // ---------------------------------------------
  // 1. Read event from URL
  // ---------------------------------------------
  const event = e && e.parameter && e.parameter.event;

  if(!event){
    return HtmlService.createHtmlOutput(
      "<h2>No event specified</h2><p>Use ?event=EVENT_NAME</p>"
    );
  }

  // ---------------------------------------------
  // 2. Load registry
  // ---------------------------------------------
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
    return HtmlService.createHtmlOutput(
      "<h2>Event not found</h2>"
    );
  }

  const spreadsheetId = row[spreadsheetIndex];

  // ---------------------------------------------
  // 3. LOAD DATA DIRECTLY (no global state)
  // ---------------------------------------------
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

  // ---------------------------------------------
  // 4. ICS download
  // ---------------------------------------------
  if(e && e.parameter.calendar){

    const rowNumber = parseInt(e.parameter.calendar);
    const record = records.find(r => r.__rowNumber === rowNumber);

    const ics = buildIcsBlob_(record);

    return ContentService
      .createTextOutput(ics.getDataAsString())
      .setMimeType(ContentService.MimeType.ICAL);
  }

  // ---------------------------------------------
  // 5. Build website WITH EVENT DATA
  // ---------------------------------------------
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

// new function
function buildConferenceWebsiteWithData_(records, registryRow){

  const schedule = buildScheduleHtml_(records);
  const speakers = buildSpeakerCards_(records);

  // Optional: get event name from registry
  const eventName = registryRow[0]; // assuming eventName is first column

  return `
<!DOCTYPE html>
<html>

<head>
<title>${eventName}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
body{font-family:Arial;margin:0;background:#f5f7fb;}
.hero{background:#0f3d75;color:white;padding:60px;text-align:center;}
.container{max-width:1200px;margin:auto;padding:40px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;}
</style>

</head>

<body>

<div class="hero">
<h1>${eventName}</h1>
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