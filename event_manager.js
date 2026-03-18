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


/*=================*/
function showMissingColumnsReport(){

  const missing = getMissingColumns_();

  if(!missing.length){
    SpreadsheetApp.getUi().alert(
      "ASMS Column Check",
      "No missing columns. This event already matches the ASMS schema.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  SpreadsheetApp.getUi().alert(
    "ASMS Column Check",
    "Missing columns:\n\n" + missing.join("\n"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/*==============*/
function addMissingColumns_(){

  const sheet = getSheet_();
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]
    .map(h => String(h).trim());

  const required = getASMSRequiredColumns_();
  const missing = required.filter(col => !headers.includes(col));

  if(!missing.length){
    SpreadsheetApp.getUi().alert("No missing columns to add.");
    return;
  }

  const startCol = sheet.getLastColumn() + 1;

  sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);

  SpreadsheetApp.getUi().alert(
    "ASMS Schema Update",
    "Added missing columns:\n\n" + missing.join("\n"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}