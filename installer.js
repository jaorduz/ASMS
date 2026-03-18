// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// ASMS Version: 1.0
// Author: Javier Orduz
// -----------------------------------------------------

function installASMS(){

try{

/* ---------------------------------
ASK BASIC EVENT INFORMATION
--------------------------------- */

const eventName = promptValue_("ASMS Installer","Enter the event name:");

const language = promptValue_("Language","Type EN or ES:");

const folderURL = promptValue_(
"Event Folder",
"Paste the Google Drive folder URL where event files should be created:"
);

const letterTemplateURL = promptValue_(
"Letter Template",
"Paste Google Doc template URL:"
);

const applicationFormURL = promptValue_(
"Application Form",
"Paste the application form URL (optional):"
);

/* ---------------------------------
GET TARGET FOLDER
--------------------------------- */

const folderId = extractGoogleId_(folderURL);
const folder = DriveApp.getFolderById(folderId);

/* CREATE SUBFOLDERS */

const subfolders = createASMSSubfolders_(folder);

/* ---------------------------------
CREATE SPREADSHEET
--------------------------------- */

const spreadsheet = createASMSSpreadsheet_(eventName);

const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
folder.addFile(spreadsheetFile);
DriveApp.getRootFolder().removeFile(spreadsheetFile);

/* ---------------------------------
CREATE CONFIRMATION FORM
--------------------------------- */

const form = createConfirmationForm_(eventName, language);

const formFile = DriveApp.getFileById(form.getId())
.setName(eventName + " — Speaker Confirmation Form");

folder.addFile(formFile);
DriveApp.getRootFolder().removeFile(formFile);

/* LINK FORM */

form.setDestination(
FormApp.DestinationType.SPREADSHEET,
spreadsheet.getId()
);

const formURL = form.getPublishedUrl();

/* ---------------------------------
SAVE CONFIGURATION
--------------------------------- */

const config = {
eventName,
language,
formURL,
letterTemplateURL,
applicationFormUrl: applicationFormURL,
spreadsheetId: spreadsheet.getId(),
formId: form.getId(),
folderId: folder.getId(),
sponsorLogosFolderId: subfolders["SponsorLogos"]
};

saveASMSProperties_(config);

/* REGISTER EVENT */

registerEvent_(config);

/* ---------------------------------
INSTALL TRIGGERS
--------------------------------- */

installASMSTriggers_(spreadsheet.getId());

SpreadsheetApp.getUi().alert(
"ASMS installed successfully.\n\nSpreadsheet created in selected folder."
);

}
catch(err){

SpreadsheetApp.getUi().alert(
"ASMS Installer cancelled.\n\n" + err.message
);

}

}

/* ======================== */

function createASMSSpreadsheet_(eventName){

const spreadsheet = SpreadsheetApp.create(
eventName + " — ASMS"
);

const sheet = spreadsheet.getActiveSheet();
sheet.setName("production");

const columns = [

"speakerName",
"speakerLastName",
"email",
"institution",
"department",
"speakerBio",
"speakerPhoto",

"TopicGral",
"WhyThisTopic",
"FocusA",
"FocusB",
"FocusC",
"FocusD",

"GuidingQuestionA",
"GuidingQuestionB",
"GuidingQuestionC",

"LastingTalk",
"DateTalk",
"TimeStartTalk",
"zoomLink",

"speakerLinkedin",
"speakerWebsite",

"status",
"confirmationStatus",
"lastEmailSent",
"lastReminderSent",
"talkReminder7Sent",
"letterRequested"

];

sheet.getRange(1,1,1,columns.length).setValues([columns]);
sheet.setFrozenRows(1);

sheet.getRange("A2").setValue("ASMS system installed.");

return spreadsheet;

}

/* ======================== */

function createASMSSubfolders_(eventFolder){

const names = [
"badges",
"certificates",
"program",
"website",
"SponsorLogos"
];

const ids = {};

names.forEach(name => {

const existing = eventFolder.getFoldersByName(name);
let folder;

if(existing.hasNext()){
folder = existing.next();
}else{
folder = eventFolder.createFolder(name);
}

ids[name] = folder.getId();

});

return ids;

}

/* ======================== */

function saveASMSProperties_(config){

const props = PropertiesService.getScriptProperties();

props.setProperty("ASMS_EVENT_NAME", config.eventName);
props.setProperty("ASMS_LANGUAGE", config.language);
props.setProperty("ASMS_FORM_URL", config.formURL);

props.setProperty("ASMS_EVENT_SPREADSHEET_ID", config.spreadsheetId);
props.setProperty("ASMS_EVENT_FORM_ID", config.formId);
props.setProperty("ASMS_EVENT_FOLDER_ID", config.folderId);

props.setProperty(
"ASMS_EVENT_LETTER_TEMPLATE_ID",
extractGoogleId_(config.letterTemplateURL)
);

props.setProperty(
"ASMS_EVENT_SPONSOR_LOGOS_FOLDER_ID",
config.sponsorLogosFolderId || ""
);

}

/* ======================== */

function extractGoogleId_(url){

const match = url.match(/[-\w]{25,}/);
return match ? match[0] : null;

}

/* ======================== */

function installASMSTriggers_(spreadsheetId){

const triggers = ScriptApp.getProjectTriggers();

triggers.forEach(t => ScriptApp.deleteTrigger(t));

ScriptApp.newTrigger("processConfirmation")
.forSpreadsheet(spreadsheetId)
.onFormSubmit()
.create();

ScriptApp.newTrigger("sendReminders")
.timeBased()
.everyDays(1)
.atHour(9)
.create();

ScriptApp.newTrigger("sendTalkReminders7Days")
.timeBased()
.everyDays(1)
.atHour(10)
.create();

}

/* ======================== */

function promptValue_(title, message){

const ui = SpreadsheetApp.getUi();

const response = ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);

if(response.getSelectedButton() !== ui.Button.OK){
throw new Error("ASMS installation cancelled by user.");
}

return response.getResponseText().trim();

}

/* ======================== */

function registerEvent_(config){

const props = PropertiesService.getScriptProperties();

let registryId = props.getProperty("ASMS_REGISTRY_ID");

let registry;

if(!registryId){

registry = SpreadsheetApp.create("ASMS Events Registry");

props.setProperty("ASMS_REGISTRY_ID", registry.getId());

}else{

registry = SpreadsheetApp.openById(registryId);

}

const sheet = registry.getSheets()[0];

/* ---------------------------------
ENSURE HEADER EXISTS
--------------------------------- */

if(sheet.getLastRow() === 0){

sheet.appendRow([
"eventName",
"spreadsheetId",
"formId",
"folderId",
"language",
"applicationFormUrl",
"created"
]);

}

/* ---------------------------------
ENSURE COLUMN EXISTS (for old registries)
--------------------------------- */

const headers = sheet.getRange(1,1,1,sheet.getLastColumn())
.getValues()[0]
.map(h => String(h).trim());

if(!headers.includes("applicationFormUrl")){

sheet.getRange(1, sheet.getLastColumn()+1)
.setValue("applicationFormUrl");

}

/* ---------------------------------
APPEND EVENT
--------------------------------- */

sheet.appendRow([
config.eventName,
config.spreadsheetId,
config.formId,
config.folderId,
config.language,
config.applicationFormUrl || "",
new Date()
]);

}