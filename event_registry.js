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

if(sheet.getLastRow() === 0){

sheet.appendRow([
"eventName",
"spreadsheetId",
"formId",
"folderId",
"language",
"applicationFormUrl", // NEW
"created"
]);

}

sheet.appendRow([
config.eventName,
config.spreadsheetId,
config.formId,
config.folderId,
config.language,
config.applicationFormUrl || "", // NEW
new Date()
]);


}