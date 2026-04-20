// -----------------------------------------------------
// Letter Invitation System
// Sheet schema
// -----------------------------------------------------

function getLetterSheetName_(){
  return "letters_data";
}

function getLetterHeaders_(){
  return [
    "firstName",
    "lastName",
    "fullName",
    "email",
    "institution",
    "department",
    "positionTitle",
    "academicGrade",
    "gender",
    "language",
    "eventName",
    "eventDate",
    "eventTime",
    "eventLocation",
    "eventFormat",
    "talkTitle",
    "eventDescription",
    "hostName",
    "hostTitle",
    "hostInstitution",
    "signatureName",
    "signatureTitle",
    "templateDocUrlES",
    "templateDocUrlEN",
    "outputFolderUrl",
    "status",
    "generatedDocUrl",
    "generatedPdfUrl",
    "notes"
  ];
}

function getOrCreateLetterSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(getLetterSheetName_());

  if(!sheet){
    sheet = ss.insertSheet(getLetterSheetName_());
  }

  return sheet;
}

function initializeLetterSheet_(){
  const sheet = getOrCreateLetterSheet_();
  const headers = getLetterHeaders_();

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);


    SpreadsheetApp.getUi().alert(
    "Letter Invitation System",
    "The letters_data sheet has been created successfully.",
    SpreadsheetApp.getUi().ButtonSet.OK
    );
}