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


function installASMS() {

const ui = SpreadsheetApp.getUi();

/* EVENT NAME */

const eventName = ui.prompt(
"ASMS Installer",
"Enter the event name:",
ui.ButtonSet.OK_CANCEL
).getResponseText();

/* LANGUAGE */

const language = ui.prompt(
"Language",
"Type EN or ES",
ui.ButtonSet.OK_CANCEL
).getResponseText();

/* CONFIRMATION FORM */

const formURL = ui.prompt(
"Confirmation Form",
"Paste the confirmation form URL:",
ui.ButtonSet.OK_CANCEL
).getResponseText();

/* LETTER TEMPLATE */

const letterTemplateURL = ui.prompt(
"Letter Template",
"Paste Google Doc template URL:",
ui.ButtonSet.OK_CANCEL
).getResponseText();

/* CREATE SPREADSHEET */

const spreadsheet = createASMSSpreadsheet_(eventName);

/* SAVE CONFIGURATION */

saveASMSProperties_({
eventName,
language,
formURL,
letterTemplateURL,
spreadsheetId: spreadsheet.getId()
});

/* INSTALL TRIGGERS */

installASMSTriggers_();

/* SUCCESS MESSAGE */

ui.alert(
"ASMS Installed Successfully",
"Spreadsheet created:\n\n" + spreadsheet.getUrl(),
ui.ButtonSet.OK
);

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

return spreadsheet;

}


/* ============== */

function saveASMSProperties_(config){

const props = PropertiesService.getScriptProperties();

props.setProperty("ASMS_EVENT_NAME",config.eventName);

props.setProperty("ASMS_LANGUAGE",config.language);

props.setProperty("ASMS_FORM_URL",config.formURL);

props.setProperty(
"ASMS_LETTER_TEMPLATE_ID",
extractGoogleId_(config.letterTemplateURL)
);

props.setProperty(
"ASMS_SPREADSHEET_ID",
config.spreadsheetId
);

}


/*================== */

function extractGoogleId_(url){

const match = url.match(/[-\w]{25,}/);

return match ? match[0] : null;

}

/*================= */
function installASMSTriggers_(){

const triggers = ScriptApp.getProjectTriggers();

triggers.forEach(t=>ScriptApp.deleteTrigger(t));

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
