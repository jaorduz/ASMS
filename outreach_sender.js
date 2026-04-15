// Step. 3


// Funciton to generate calendar

// function getConferenceCalendarBlob_(){

//   // Reuse your existing generator
//   const blob = generateConferenceCalendar_();

//   // Ensure consistent name
//   blob.setName("conference_schedule.ics");

//   return blob;

// }
function getConferenceCalendarBlob_(){

  const eventFolder = getEventFolder_();
  const programFolder = getOrCreateSubfolder_(eventFolder,"program");

  const files = programFolder.getFilesByName("conference_schedule.ics");

  if(files.hasNext()){
    return files.next().getBlob(); // reuse existing
  }

  // fallback: generate if missing
  const blob = generateConferenceCalendar_();
  blob.setName("conference_schedule.ics");

  programFolder.createFile(blob);

  return blob;
}

// Get outreach data helper.
function getOutreachData_(){

  const ss = SpreadsheetApp.openById(getActiveSpreadsheetId_());
  const sheet = ss.getSheetByName("audience_outreach");

  if(!sheet) throw new Error("audience_outreach sheet not found");

  const values = sheet.getDataRange().getValues();

  const headers = values.shift();

  const records = values.map((row,i)=>{
    const obj = {};
    headers.forEach((h,j)=>obj[h]=row[j]);
    obj.__rowNumber = i + 2;
    return obj;
  });

  return {sheet, headers, records};
}

// Preview email

function previewOutreachEmail(){

  const {records} = getOutreachData_();

  const selected = records.find(r =>
    String(r.selected).toLowerCase() === "true"
  );

  if(!selected){
    SpreadsheetApp.getUi().alert("No selected row found.");
    return;
  }

  const html = buildOutreachHtml_(selected);

  const output = HtmlService
    .createHtmlOutput(html)
    .setWidth(700)
    .setHeight(600);

  SpreadsheetApp.getUi()
    .showModalDialog(output, "Outreach Email Preview");

}

// Send one email 

function sendOutreachEmail_(record){

  const email = getOutreachField_(record,"email");

  if(!email){
    throw new Error("Missing email");
  }

  const subject = buildOutreachSubject_(record);
  const html = buildOutreachHtml_(record);
  const text = buildOutreachPlainText_(record);

//   GmailApp.sendEmail(email, subject, text, {
//     htmlBody: html
//   });
const calendarBlob = getConferenceCalendarBlob_();

GmailApp.sendEmail(email, subject, text, {
  htmlBody: html,
  attachments: [calendarBlob]
});
}

// Send selected emails

function sendSelectedOutreachEmails(){

  const {sheet, records, headers} = getOutreachData_();

  const colStatus = headers.indexOf("emailStatus") + 1;
  const colLastSent = headers.indexOf("lastEmailSent") + 1;

  let sent = 0;
  let errors = 0;

  records.forEach(r=>{

    const isSelected = String(r.selected).toLowerCase() === "true";

    if(!isSelected) return;

    try{

      sendOutreachEmail_(r);

      sheet.getRange(r.__rowNumber, colStatus).setValue("Sent");
      sheet.getRange(r.__rowNumber, colLastSent).setValue(new Date());

      sent++;

    }catch(err){

      sheet.getRange(r.__rowNumber, colStatus)
        .setValue("Error: " + err.message);

      errors++;

    }

  });

  SpreadsheetApp.getUi().alert(
    `Outreach complete\n\nSent: ${sent}\nErrors: ${errors}`
  );

}

// Send onlny pending

function sendPendingOutreachEmails(){

  const {sheet, records, headers} = getOutreachData_();

  const colStatus = headers.indexOf("emailStatus") + 1;
  const colLastSent = headers.indexOf("lastEmailSent") + 1;

  records.forEach(r=>{

    if(r.emailStatus === "Sent") return;

    try{

      sendOutreachEmail_(r);

      sheet.getRange(r.__rowNumber, colStatus).setValue("Sent");
      sheet.getRange(r.__rowNumber, colLastSent).setValue(new Date());

    }catch(err){

      sheet.getRange(r.__rowNumber, colStatus)
        .setValue("Error: " + err.message);

    }

  });

}