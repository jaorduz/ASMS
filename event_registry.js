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
ENSURE applicationFormUrl COLUMN EXISTS
--------------------------------- */

const headers = sheet.getRange(1,1,1,sheet.getLastColumn())
.getValues()[0]
.map(h => String(h).trim());

if(!headers.includes("applicationFormUrl")){

sheet.getRange(1, sheet.getLastColumn()+1)
.setValue("applicationFormUrl");

}



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