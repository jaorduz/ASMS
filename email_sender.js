// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------


// -----------------------------------------------------
// EMAIL SENDING LOGIC
// This file handles sending emails using templates.
// Templates are defined in email_templates.gs
// -----------------------------------------------------



/**
 * Preview invitation email using the first spreadsheet row.
 * Opens a modal window showing the HTML email.
 */
function previewInvitation() {

  const {records} = getData_();

  if(!records.length){
    SpreadsheetApp.getUi().alert("No records found.");
    return;
  }

  const record = records[0];

  const html = buildHtmlInvitation_(record);

  const output = HtmlService
  .createHtmlOutput(html)
  .setWidth(760)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    output,
    "Invitation Preview"
  );

}




/**
 * Sends invitation emails to speakers.
 *
 * Rules:
 * - Must have valid email
 * - Must not already be sent
 * - Must not already be confirmed
 */
function sendInvitations(){

  const {sheet,headers,records} = getData_();

  const colMap = getColumnIndexMap_(headers);

  let sentCount = 0;

  records.forEach(record=>{

    const email = formatValue_(record.email);
    const status = formatValue_(record.status);
    const confirmationStatus = normalizeConfirmationStatus_(record.confirmationStatus);


    // -------------------------------------
    // Skip invalid emails
    // -------------------------------------
    if(!email || !email.includes("@")) return;


    // -------------------------------------
    // Skip already sent invitations
    // -------------------------------------
    if(status === "Sent") return;


    // -------------------------------------
    // Skip already confirmed speakers
    // -------------------------------------
    if(confirmationStatus === "Confirmed") return;



    // -------------------------------------
    // Send email
    // -------------------------------------
    GmailApp.sendEmail(

      email,

      `Invitation to Speak — ${CONFIG.EVENT.name}`,

      "Your email client does not support HTML emails.",

      {
        htmlBody: buildHtmlInvitation_(record),
        name: CONFIG.ORGANIZER.name
      }

    );


    // -------------------------------------
    // Update spreadsheet tracking
    // -------------------------------------

    if(colMap.status){
      sheet.getRange(record.__rowNumber,colMap.status)
      .setValue("Sent");
    }


    if(colMap.lastEmailSent){
      sheet.getRange(record.__rowNumber,colMap.lastEmailSent)
      .setValue(new Date());
    }


    sentCount++;


    // Avoid Gmail rate limits
    Utilities.sleep(300);

  });


  SpreadsheetApp.getUi().alert(`${sentCount} invitations sent.`);

}