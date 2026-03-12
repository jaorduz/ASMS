// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------


// -----------------------------------------------------
// REMINDER EMAILS
// Handles follow-up emails for speakers
// -----------------------------------------------------


/**
 * Send reminder emails to speakers who were invited
 * but have not yet confirmed their participation.
 *
 * Conditions:
 * - Invitation was already sent
 * - Speaker has not confirmed or declined
 * - Last reminder was sent more than 3 days ago
 */
function sendReminders() {

  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    "Send Reminders",
    "Send reminder emails to invited speakers who have not confirmed?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const { sheet, headers, records } = getData_();
  const cols = getColumnIndexMap_(headers);

  let reminderCount = 0;

  records.forEach(record => {

    const email = formatValue_(record.email);
    const status = formatValue_(record.status);
    const confirmationStatus = normalizeConfirmationStatus_(record.confirmationStatus);
    const lastReminderSent = record.lastReminderSent;

    // Skip invalid emails
    if (!email || !email.includes("@")) return;

    // Only remind speakers who already received invitation
    if (status !== "Sent") return;

    // Skip confirmed or declined speakers
    if (confirmationStatus === "Confirmed" || confirmationStatus === "Declined") return;

    // Prevent sending reminders too frequently
    if (lastReminderSent && daysSince_(lastReminderSent) < 3) return;


    // -----------------------------------------
    // Send reminder email
    // -----------------------------------------

    GmailApp.sendEmail(
      email,
      reminderSubject_(record),
      buildPlainReminder_(record),
      {
        htmlBody: buildHtmlReminder_(record),
        name: CONFIG.ORGANIZER.name
      }
    );


    // -----------------------------------------
    // Update spreadsheet tracking
    // -----------------------------------------

    if (cols.lastReminderSent) {
      sheet.getRange(record.__rowNumber, cols.lastReminderSent).setValue(new Date());
    }

    if (cols.confirmationStatus && !formatValue_(record.confirmationStatus)) {
      sheet.getRange(record.__rowNumber, cols.confirmationStatus).setValue("Pending");
    }

    reminderCount++;

    // Avoid Gmail throttling
    Utilities.sleep(400);

  });

  ui.alert(`Done. Reminder emails sent: ${reminderCount}`);
}




// -----------------------------------------------------
// SESSION REMINDER (7 DAYS BEFORE TALK)
// -----------------------------------------------------

/**
 * Sends reminder emails to confirmed speakers
 * exactly 7 days before their talk.
 *
 * Includes the calendar (.ics) file.
 */

function sendTalkReminders7DaysManual(){

const ui = SpreadsheetApp.getUi();

const response = ui.alert(
"Send 7-Day Talk Reminders",
"Send reminders to speakers whose session is in 7 days?",
ui.ButtonSet.YES_NO
);

if(response !== ui.Button.YES) return;

sendTalkReminders7Days(); // call background logic
}

function sendTalkReminders7Days(){

const {sheet,headers,records} = getData_();

let sentCount = 0;

records.forEach(record=>{

const email = formatValue_(record.email);

if(!email) return;

/* logic continues */

});

}
