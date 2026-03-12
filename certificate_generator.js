// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------



// -----------------------------------------------------
// CERTIFICATE GENERATOR
// Creates PDF certificates for confirmed speakers
// using a Google Docs template.
// -----------------------------------------------------



/**
 * Generates a PDF certificate for a single speaker.
 *
 * Template placeholders required in the Google Doc:
 *
 * {{NAME}}
 * {{EVENT}}
 * {{TITLE}}
 * {{DATE}}
 */
function generateCertificate(record){

const templateId = "PUT_CERTIFICATE_TEMPLATE_ID";

const folderId = "PUT_CERTIFICATE_FOLDER_ID";


// --------------------------------------------
// Access template and output folder
// --------------------------------------------
const template = DriveApp.getFileById(templateId);

const folder = DriveApp.getFolderById(folderId);


// --------------------------------------------
// Create a temporary document copy
// --------------------------------------------
const copy = template.makeCopy(folder);

const doc = DocumentApp.openById(copy.getId());

const body = doc.getBody();


// --------------------------------------------
// Replace template variables
// --------------------------------------------
const fullName = formatValue_(record.speakerName) + " " + formatValue_(record.speakerLastName);

body.replaceText("{{NAME}}", fullName);

body.replaceText("{{EVENT}}", CONFIG.EVENT.name);

body.replaceText("{{TITLE}}", formatValue_(record.TopicGral));

body.replaceText("{{DATE}}", formatDateForDisplay_(record.DateTalk));


// --------------------------------------------
// Save document
// --------------------------------------------
doc.saveAndClose();


// --------------------------------------------
// Export as PDF
// --------------------------------------------
const pdf = DriveApp.getFileById(copy.getId())
.getAs("application/pdf")
.setName(
  "Certificate_" + sanitizeFilename_(fullName) + ".pdf"
);


// --------------------------------------------
// Remove temporary document
// --------------------------------------------
DriveApp.getFileById(copy.getId()).setTrashed(true);


// --------------------------------------------
// Return PDF file
// --------------------------------------------
return pdf;

}



/**
 * Generates certificates for all confirmed speakers.
 */
function sendCertificates(){

const {records} = getData_();

let count = 0;

records.forEach(record => {

if(normalizeConfirmationStatus_(record.confirmationStatus) !== "Confirmed")
return;

generateCertificate(record);

count++;

});

SpreadsheetApp.getUi().alert(
`${count} certificates generated.`
);

}