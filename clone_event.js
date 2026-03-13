/*============ */ //Clone

function cloneASMSEvent(){

const registryId = PropertiesService
.getScriptProperties()
.getProperty("ASMS_REGISTRY_ID");

if(!registryId){

SpreadsheetApp.getUi().alert(
"No ASMS registry found."
);

return;

}

const registry = SpreadsheetApp.openById(registryId);
const sheet = registry.getSheets()[0];

const values = sheet.getDataRange().getValues();
values.shift(); // remove header

if(values.length === 0){

SpreadsheetApp.getUi().alert(
"No events available to clone."
);

return;

}

/* Select event */

const events = values.map(r=>r[0]).join("\n");

const response = SpreadsheetApp.getUi().prompt(
"Clone Event",
"Available events:\n\n"+events+"\n\nType the event name to clone:",
SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
);

if(response.getSelectedButton() !== SpreadsheetApp.getUi().Button.OK){
return;
}

const selected = response.getResponseText();

/* find event */

const row = values.find(r => r[0] === selected);

if(!row){

SpreadsheetApp.getUi().alert("Event not found.");
return;

}

const originalFolderId = row[3];

/* ask new event name */

const newNameResponse = SpreadsheetApp.getUi().prompt(
"New Event Name",
"Enter the new event name:",
SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
);

if(newNameResponse.getSelectedButton() !== SpreadsheetApp.getUi().Button.OK){
return;
}

const newEventName = newNameResponse.getResponseText();

/* create new folder */

const parentFolder = DriveApp
.getFolderById(originalFolderId)
.getParents()
.next();

const newFolder = parentFolder.createFolder(newEventName);

/* run installer logic */

const language = "EN";

const spreadsheet = createASMSSpreadsheet_(newEventName);

const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());

newFolder.addFile(spreadsheetFile);

DriveApp.getRootFolder().removeFile(spreadsheetFile);

/* create form */

const form = createConfirmationForm_(newEventName, language);

const formFile = DriveApp.getFileById(form.getId());

newFolder.addFile(formFile);

DriveApp.getRootFolder().removeFile(formFile);

/* link form */

form.setDestination(
FormApp.DestinationType.SPREADSHEET,
spreadsheet.getId()
);

/* configuration */

const config = {

eventName:newEventName,
language,
formURL:form.getPublishedUrl(),
letterTemplateURL:"",
spreadsheetId:spreadsheet.getId(),
formId:form.getId(),
folderId:newFolder.getId()

};

saveASMSProperties_(config);

registerEvent_(config);

SpreadsheetApp.getUi().alert(
"Event cloned successfully."
);

}