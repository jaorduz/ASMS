// Step 5
// -----------------------------------------------------
// ASMS Outreach Schema
// Validates and repairs the audience_outreach sheet
// -----------------------------------------------------

function getOutreachSheetName_(){
  return "audience_outreach";
}

function getOutreachRequiredColumns_(){
  return [
    "firstName",
    "lastName",
    "email",
    "emailStatus",
    "selected",
    "emailTemplate",
    "customSubject",
    "customMessage",
    "calendarIcsUrl",
    "zoomLink",
    "talkTime",
    "talkTitle",
    "eventName",
    "eventUrl1",
    "eventUrl2",
    "registrationFormUrl",
    "notes",
    "lastEmailSent",
    "campaignTag",
    "languageEmail"
  ];
}

// Funtion to get or create the reach sheet.
function getOrCreateOutreachSheet_(){

  const ss = SpreadsheetApp.openById(getActiveSpreadsheetId_());
  let sheet = ss.getSheetByName(getOutreachSheetName_());

  if(!sheet){
    sheet = ss.insertSheet(getOutreachSheetName_());
  }

  return sheet;
}


// Function to initialize
function initializeOutreachSheet_(){

  const sheet = getOrCreateOutreachSheet_();
  const required = getOutreachRequiredColumns_();

  if(sheet.getLastRow() === 0){
    sheet.getRange(1,1,1,required.length).setValues([required]);
    sheet.setFrozenRows(1);
    SpreadsheetApp.getUi().alert(
      "ASMS Outreach",
      "The audience_outreach sheet was created and initialized.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  SpreadsheetApp.getUi().alert(
    "ASMS Outreach",
    "The audience_outreach sheet already exists.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


// Function 
function getMissingOutreachColumns_(){

  const sheet = getOrCreateOutreachSheet_();
  const required = getOutreachRequiredColumns_();

  if(sheet.getLastColumn() === 0){
    return required;
  }

  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]
    .map(h => String(h).trim());

  return required.filter(col => !headers.includes(col));
}

// Function 
function showMissingOutreachColumnsReport(){

  const missing = getMissingOutreachColumns_();

  if(!missing.length){
    SpreadsheetApp.getUi().alert(
      "ASMS Outreach",
      "No missing outreach columns were found.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  SpreadsheetApp.getUi().alert(
    "ASMS Outreach",
    "Missing outreach columns:\n\n" + missing.join("\n"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// Function

function addMissingOutreachColumns_(){

  const sheet = getOrCreateOutreachSheet_();
  const missing = getMissingOutreachColumns_();

  if(!missing.length){
    SpreadsheetApp.getUi().alert(
      "ASMS Outreach",
      "No missing outreach columns to add.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  const startCol = sheet.getLastColumn() + 1;
  sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);

  SpreadsheetApp.getUi().alert(
    "ASMS Outreach",
    "Added missing outreach columns:\n\n" + missing.join("\n"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}