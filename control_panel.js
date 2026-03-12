// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------


// -----------------------------------------------------
// BOOTCAMP CONTROL PANEL
// Provides diagnostics and system overview
// -----------------------------------------------------



/**
 * Runs a full system diagnostic.
 * Checks if all critical components are working.
 */
function runSystemDiagnostics(){

const ui = SpreadsheetApp.getUi();

let report = [];


// -------------------------------------
// Check Spreadsheet
// -------------------------------------

try{

const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
report.push("✔ Spreadsheet connected");

}catch(e){

report.push("❌ Spreadsheet ID invalid");

}



// -------------------------------------
// Check Sheet Name
// -------------------------------------

try{

const sheet = getSheet_();

report.push("✔ Sheet found: " + CONFIG.SHEET_NAME);

}catch(e){

report.push("❌ Sheet not found: " + CONFIG.SHEET_NAME);

}



// -------------------------------------
// Check records
// -------------------------------------

try{

const {records} = getData_();

report.push("✔ Records loaded: " + records.length);

}catch(e){

report.push("❌ Could not read spreadsheet data");

}



// -------------------------------------
// Check email template
// -------------------------------------

try{

const {records} = getData_();

if(records.length){

buildHtmlInvitation_(records[0]);

report.push("✔ Email template works");

}else{

report.push("⚠ No records to test email template");

}

}catch(e){

report.push("❌ Email template error");

}



// -------------------------------------
// Check calendar generator
// -------------------------------------

try{

const {records} = getData_();

if(records.length){

buildIcsBlob_(records[0]);

report.push("✔ Calendar generator works");

}

}catch(e){

report.push("❌ Calendar generator error");

}



// -------------------------------------
// Check badge generator
// -------------------------------------

try{

const {records} = getData_();

if(records.length){

generateBadge(records[0]);

report.push("✔ Badge generator works");

}

}catch(e){

report.push("❌ Badge generator error");

}



// -------------------------------------
// Show report
// -------------------------------------

ui.alert(
"Bootcamp System Diagnostics",
report.join("\n"),
ui.ButtonSet.OK
);

}




/**
 * Shows a quick overview of the speaker status.
 */
function showSystemSummary(){

const {records} = getData_();

let invited = 0;
let confirmed = 0;
let declined = 0;
let pending = 0;

records.forEach(r=>{

const status = normalizeConfirmationStatus_(r.confirmationStatus);

if(status=="Confirmed") confirmed++;
else if(status=="Declined") declined++;
else pending++;

if(r.status=="Sent") invited++;

});

SpreadsheetApp.getUi().alert(

`Bootcamp Overview

Total speakers: ${records.length}

Invitations sent: ${invited}

Confirmed speakers: ${confirmed}

Pending responses: ${pending}

Declined: ${declined}

`

);

}



/**
 * Test the email template safely without sending email.
 */
function testEmailTemplate(){

const {records} = getData_();

if(!records.length){

SpreadsheetApp.getUi().alert("No test data available");

return;

}

previewInvitation();

}