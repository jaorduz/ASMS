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


/**
 * Returns the active sheet defined in CONFIG
 * This is the main sheet used by the system (test or production).
 */
function getSheet_(){

  // Open spreadsheet using ID defined in config.gs
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // Select the sheet name defined in config.gs
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Safety check in case the sheet name is wrong
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