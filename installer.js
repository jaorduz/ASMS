// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// ASMS Version: 1.0
// Author: Javier Orduz

// ASMS Installer
// Sets up a new event environment
// ASMS Installer v1
// Advanced System for Meetings Support

// This script installs a new ASMS event environment.

// Responsibilities:
// - configure event properties
// - create spreadsheet
// - register templates
// - install triggers
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


/* ---------------------------------
GET TARGET FOLDER
--------------------------------- */

const folderId = extractGoogleId_(folderURL);

const folder = DriveApp.getFolderById(folderId);

const subfolders = createASMSSubfolders_(folder);
/* ---------------------------------
const subfolders = createASMSSubfolders_(folder);
--------------------------------- */


/* ---------------------------------
CREATE SPREADSHEET
--------------------------------- */

const spreadsheet = createASMSSpreadsheet_(eventName);

/* Move spreadsheet into event folder */

const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());

folder.addFile(spreadsheetFile);

DriveApp.getRootFolder().removeFile(spreadsheetFile);


/* ---------------------------------
CREATE APPLICATION FORM
--------------------------------- */

const applicationData = createApplicationForm_(
  eventName,
  language,
  folder
);

const applicationForm = applicationData.form;
const uploadsFolder = applicationData.uploadsFolder;

/* Move application form */
const appFormFile = DriveApp.getFileById(applicationForm.getId())
.setName(eventName + " — Application Form");

folder.addFile(appFormFile);
DriveApp.getRootFolder().removeFile(appFormFile);

/* Get URL */
const applicationFormURL = applicationForm.getPublishedUrl();
/*============*/

const form = createConfirmationForm_(eventName, language);


/* MOVE FORM TO EVENT FOLDER */

const formFile = DriveApp.getFileById(form.getId()).setName(eventName + " — Speaker Confirmation Form");

folder.addFile(formFile);

DriveApp.getRootFolder().removeFile(formFile);


/* LINK FORM TO SPREADSHEET */

form.setDestination(
FormApp.DestinationType.SPREADSHEET,
spreadsheet.getId()
);




/* ---------------------------------
GET FORM URL
--------------------------------- */

const formURL = form.getPublishedUrl();


/* SAVE CONFIGURATION */

const config = {

eventName,
language,
formURL,
letterTemplateURL,
spreadsheetId: spreadsheet.getId(),
formId: form.getId(),
folderId: folder.getId(),
sponsorLogosFolderId: subfolders["SponsorLogos"],

/* ✅ NEW */
applicationFormId: applicationForm.getId(),
applicationFormURL: applicationFormURL,
applicationUploadFolderId: uploadsFolder.getId()

};

saveASMSProperties_(config);

/* ========================*/
registerEvent_(config);


/* ---------------------------------
INSTALL TRIGGERS
--------------------------------- */

installASMSTriggers_(spreadsheet.getId());


/* ---------------------------------
SUCCESS MESSAGE
--------------------------------- */

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

sheet.getRange("A2")
.setValue("ASMS system installed.");

return spreadsheet;

}



/** ==============*/
function createASMSSubfolders_(eventFolder){

const names = [
  "badges",
  "certificates",
  "program",
  "website",
  "SponsorLogos",
  "applications"   // ✅ NEW
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

/** ==============*/


/* ============== */

function saveASMSProperties_(config){

const props = PropertiesService.getScriptProperties();

props.setProperty("ASMS_EVENT_NAME", config.eventName);

props.setProperty("ASMS_LANGUAGE", config.language);

props.setProperty("ASMS_FORM_URL", config.formURL);

props.setProperty(
"ASMS_EVENT_SPREADSHEET_ID",
config.spreadsheetId
);

props.setProperty(
"ASMS_EVENT_FORM_ID",
config.formId
);

props.setProperty(
"ASMS_EVENT_FOLDER_ID",
config.folderId
);

props.setProperty(
"ASMS_EVENT_LETTER_TEMPLATE_ID",
extractGoogleId_(config.letterTemplateURL)
);


props.setProperty(
"ASMS_EVENT_SPONSOR_LOGOS_FOLDER_ID",
config.sponsorLogosFolderId || ""
);

/*=========*/
props.setProperty(
"ASMS_EVENT_APPLICATION_FORM_ID",
config.applicationFormId || ""
);

props.setProperty(
"ASMS_EVENT_APPLICATION_FORM_URL",
config.applicationFormURL || ""
);

props.setProperty(
"ASMS_EVENT_APPLICATION_UPLOAD_FOLDER_ID",
config.applicationUploadFolderId || ""
);

}



/*================== */

function extractGoogleId_(url){

const match = url.match(/[-\w]{25,}/);

return match ? match[0] : null;

}

/*================= */
function installASMSTriggers_(spreadsheetId){

const triggers = ScriptApp.getProjectTriggers();

/* remove existing triggers */

triggers.forEach(t => ScriptApp.deleteTrigger(t));

/* form confirmation trigger */

ScriptApp.newTrigger("processConfirmation")
.forSpreadsheet(spreadsheetId)
.onFormSubmit()
.create();

/* reminder triggers */

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
/*================= */

function promptValue_(title, message){

const ui = SpreadsheetApp.getUi();

const response = ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);

if(response.getSelectedButton() !== ui.Button.OK){
throw new Error("ASMS installation cancelled by user.");
}

return response.getResponseText().trim();

}


/*=================*/
function registerEvent_(config){

const registryId = PropertiesService
.getScriptProperties()
.getProperty("ASMS_REGISTRY_ID");

let registry;

if(!registryId){

registry = SpreadsheetApp.create("ASMS Events Registry");

PropertiesService.getScriptProperties()
.setProperty("ASMS_REGISTRY_ID", registry.getId());

}else{

registry = SpreadsheetApp.openById(registryId);

}

const sheet = registry.getSheets()[0];

if(sheet.getLastRow() === 0){

sheet.appendRow([
"eventName",
"spreadsheetId",
"formId",
"folderId",
"language",
"created"
]);

}

sheet.appendRow([
config.eventName,
config.spreadsheetId,
config.formId,
config.folderId,
config.language,
new Date()
]);

}
