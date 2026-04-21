// -----------------------------------------------------
// Letter Invitation System
// Letter generation
// -----------------------------------------------------

function getLetterData_(){
  const sheet = getOrCreateLetterSheet_();
  const values = sheet.getDataRange().getValues();

  if(values.length < 2){
    return { sheet, headers: [], records: [] };
  }

  const headers = values[0].map(h => String(h).trim());

  const records = [];

  for(let i = 1; i < values.length; i++){
    const row = values[i];

    const isBlank = row.every(cell => String(cell || "").trim() === "");
    if(isBlank) continue;

    const obj = {};
    headers.forEach((h, j) => obj[h] = row[j]);
    obj.__rowNumber = i + 1;

    records.push(obj);
  }

  return { sheet, headers, records };
}

function generateLetterFromRecord_(record){

  const templateUrl = getLetterTemplateUrl_(record);
  const outputFolderUrl = getLetterField_(record, "outputFolderUrl");

  if(!templateUrl){
    throw new Error("Missing templateDocUrl for selected language.");
  }

  if(!outputFolderUrl){
    throw new Error("Missing outputFolderUrl.");
  }

  const templateId = extractGoogleId_(templateUrl);
  const folderId = extractGoogleId_(outputFolderUrl);

  const templateFile = DriveApp.getFileById(templateId);
  const outputFolder = DriveApp.getFolderById(folderId);

  const fileName = `Invitation Letter - ${buildRecipientTitle_(record)}`;

  const copy = templateFile.makeCopy(fileName, outputFolder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  const replacements = getLetterReplacementMap_(record);

  Object.keys(replacements).forEach(key => {
    body.replaceText(key, replacements[key]);
  });

  doc.saveAndClose();

  const pdfBlob = copy.getBlob().getAs(LETTER_CONFIG.outputPdfMimeType);
  const pdfFile = outputFolder.createFile(pdfBlob).setName(fileName + ".pdf");

  return {
    docUrl: copy.getUrl(),
    pdfUrl: pdfFile.getUrl()
  };
}

function generateLetterForActiveRow(){
  const { sheet, headers, records } = getLetterData_();
  const activeRow = sheet.getActiveRange().getRow();

  if(activeRow < 2){
    SpreadsheetApp.getUi().alert("Please select a valid data row.");
    return;
  }

  const record = records.find(r => r.__rowNumber === activeRow);

  if(!record){
    SpreadsheetApp.getUi().alert("No record found for the selected row.");
    return;
  }

  try{
    const result = generateLetterFromRecord_(record);

    const colStatus = headers.indexOf("status") + 1;
    const colDoc = headers.indexOf("generatedDocUrl") + 1;
    const colPdf = headers.indexOf("generatedPdfUrl") + 1;

    if(colStatus) sheet.getRange(activeRow, colStatus).setValue("Generated");
    if(colDoc) sheet.getRange(activeRow, colDoc).setValue(result.docUrl);
    if(colPdf) sheet.getRange(activeRow, colPdf).setValue(result.pdfUrl);

    SpreadsheetApp.getUi().alert("Letter generated successfully.");
  }catch(err){
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}

function generateAllPendingLetters(){

const fullName = getLetterField_(record, "fullName");
const firstName = getLetterField_(record, "firstName");
const lastName = getLetterField_(record, "lastName");
const email = getLetterField_(record, "email");

if(!fullName && !firstName && !lastName && !email){
  return;
}

  const { sheet, headers, records } = getLetterData_();

  const colStatus = headers.indexOf("status") + 1;
  const colDoc = headers.indexOf("generatedDocUrl") + 1;
  const colPdf = headers.indexOf("generatedPdfUrl") + 1;

  let generated = 0;
  let errors = 0;

  records.forEach(record => {
    const status = getLetterField_(record, "status").toLowerCase();

    if(status && status === "generated") return;

    try{
      const result = generateLetterFromRecord_(record);

      if(colStatus) sheet.getRange(record.__rowNumber, colStatus).setValue("Generated");
      if(colDoc) sheet.getRange(record.__rowNumber, colDoc).setValue(result.docUrl);
      if(colPdf) sheet.getRange(record.__rowNumber, colPdf).setValue(result.pdfUrl);

      generated++;
      Utilities.sleep(400);

    }catch(err){
      if(colStatus) sheet.getRange(record.__rowNumber, colStatus).setValue("Error");
      errors++;
    }
  });

  SpreadsheetApp.getUi().alert(
    `Completed.\n\nGenerated: ${generated}\nErrors: ${errors}`
  );
}