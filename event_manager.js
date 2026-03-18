// -----------------------------------------------------
// ASMS Event Manager
// Handles selecting and switching between events
// -----------------------------------------------------

function selectASMSEvent(){

const registryId = PropertiesService
.getScriptProperties()
.getProperty("ASMS_REGISTRY_ID");

if(!registryId){
SpreadsheetApp.getUi().alert("No ASMS registry found.");
return;
}

const registry = SpreadsheetApp.openById(registryId);
const sheet = registry.getSheets()[0];

const rows = sheet.getDataRange().getValues();

rows.shift(); // remove header

if(rows.length === 0){
SpreadsheetApp.getUi().alert("No events available.");
return;
}

const events = rows.map(r => r[0]).join("\n");

const response = SpreadsheetApp.getUi().prompt(
"Select ASMS Event",
"Available events:\n\n"+events+"\n\nType the event name:",
SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
);

if(response.getSelectedButton() !== SpreadsheetApp.getUi().Button.OK){
return;
}

const selected = response.getResponseText();

const eventRow = rows.find(r => r[0] === selected);

if(!eventRow){

SpreadsheetApp.getUi().alert("Event not found.");
return;

}

PropertiesService.getScriptProperties()
.setProperty("ASMS_ACTIVE_EVENT_ID",eventRow[1]);

SpreadsheetApp.getUi().alert(
"Active event set to:\n\n"+selected
);

}