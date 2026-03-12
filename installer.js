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

const eventName = promptValue_("ASMS Installer","Enter the event name:");
const language = promptValue_("Language","Type EN or ES:");
const letterTemplateURL = promptValue_("Letter Template","Paste Google Doc template URL:");

/* CREATE SPREADSHEET */

const spreadsheet = createASMSSpreadsheet_(eventName);

/* CREATE FORM */

const form = createConfirmationForm_(eventName, language);

/* LINK FORM TO SPREADSHEET */

form.setDestination(
FormApp.DestinationType.SPREADSHEET,
spreadsheet.getId()
);

/* GET FORM URL */

const formURL = form.getPublishedUrl();

/* SAVE CONFIGURATION */

saveASMSProperties_({
eventName,
language,
formURL,
letterTemplateURL,
spreadsheetId: spreadsheet.getId(),
formId: form.getId()
});

/* INSTALL TRIGGERS */

installASMSTriggers_(spreadsheet.getId());

SpreadsheetApp.getUi().alert(
"ASMS installed successfully."
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


/* ============== */

function saveASMSProperties_(config){

const props = PropertiesService.getScriptProperties();

props.setProperty("ASMS_EVENT_NAME", config.eventName);

props.setProperty("ASMS_LANGUAGE", config.language);

props.setProperty("ASMS_FORM_URL", config.formURL);

props.setProperty(
"ASMS_LETTER_TEMPLATE_ID",
extractGoogleId_(config.letterTemplateURL)
);

props.setProperty(
"ASMS_SPREADSHEET_ID",
config.spreadsheetId
);

props.setProperty(
"ASMS_FORM_ID",
config.formId
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