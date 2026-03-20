// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------

// -----------------------------------------------------
// DATA ACCESS LAYER
// This file handles all communication with the spreadsheet
// -----------------------------------------------------


function getActiveSpreadsheetId_(){

const id = PropertiesService
.getScriptProperties()
.getProperty("ASMS_ACTIVE_EVENT_ID");

if(!id){

throw new Error(
"No active ASMS event selected.\n\nUse ASMS → Select Event."
);

}

return id;

}

/**
 * Returns the active sheet defined in CONFIG
 * This is the main sheet used by the system (test or production).
 */
function getSheet_(){

const spreadsheetId = getActiveSpreadsheetId_();

const ss = SpreadsheetApp.openById(spreadsheetId);

const sheet = ss.getSheetByName("production");

if(!sheet) throw new Error("Sheet not found");

return sheet;

}



/**
 * Reads all data from the spreadsheet and converts it into
 * a structured object format that is easier to use in the code.
 *
 * Output:
 * {
 *   sheet: reference to sheet
 *   headers: column headers
 *   records: array of objects (one per row)
 * }
 */
function getData_(){

  // Get the working sheet
  const sheet = getSheet_();

  // Read all spreadsheet values
  const values = sheet.getDataRange().getValues();

  // Extract first row as column headers
  const headers = values.shift();

  // Convert rows into objects
  const records = values.map((row,i)=>{

    const obj = {};

    // Map each column header to its corresponding value
    headers.forEach((h,j)=>obj[h]=row[j]);

    // Store the original spreadsheet row number
    // (used later for updating status fields)
    obj.__rowNumber = i + 2;

    return obj;

  });

  return {sheet,headers,records};

}