function registerEvent_(config){

  const props = PropertiesService.getScriptProperties();

  let registryId = props.getProperty("ASMS_REGISTRY_ID");

  let registry;

  /* -------------------------------------------------
  CREATE OR OPEN REGISTRY
  ------------------------------------------------- */

  if(!registryId){

    registry = SpreadsheetApp.create("ASMS Events Registry");

    props.setProperty("ASMS_REGISTRY_ID", registry.getId());

  }else{

    registry = SpreadsheetApp.openById(registryId);

  }

  const sheet = registry.getSheets()[0];

  /* -------------------------------------------------
  DEFINE SCHEMA (UPDATED)
  ------------------------------------------------- */

  const requiredHeaders = [
    "eventName",
    "spreadsheetId",
    "formId",
    "folderId",
    "language",
    "applicationFormUrl", // ✅ NEW COLUMN
    "created"
  ];

  /* -------------------------------------------------
  INITIALIZE OR UPGRADE HEADER
  ------------------------------------------------- */

  if(sheet.getLastRow() === 0){

    sheet.appendRow(requiredHeaders);

  }else{

    const currentHeaders = sheet
      .getRange(1,1,1,sheet.getLastColumn())
      .getValues()[0];

    const missing = requiredHeaders.filter(h => !currentHeaders.includes(h));

    if(missing.length){

      sheet.getRange(1, currentHeaders.length + 1, 1, missing.length)
        .setValues([missing]);
    }

  }

  /* -------------------------------------------------
  BUILD ROW SAFELY (MATCH HEADER ORDER)
  ------------------------------------------------- */

  const headers = sheet
    .getRange(1,1,1,sheet.getLastColumn())
    .getValues()[0];

  const row = headers.map(h => {

    switch(h){

      case "eventName":
        return config.eventName;

      case "spreadsheetId":
        return config.spreadsheetId;

      case "formId":
        return config.formId;

      case "folderId":
        return config.folderId;

      case "language":
        return config.language;

      case "applicationFormUrl":
        return config.applicationFormUrl || ""; // ✅ SAFE

      case "created":
        return new Date();

      default:
        return "";
    }

  });

  /* -------------------------------------------------
  APPEND ROW
  ------------------------------------------------- */

  sheet.appendRow(row);

}