// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------

function onOpen(){

SpreadsheetApp.getUi()

.createMenu("ASMS")

.addItem("Select Event","selectASMSEvent")

.addSeparator()

.addItem("Install ASMS Event","installASMS")
.addItem("Clone Event","cloneASMSEvent")

.addSeparator()
.addItem("System Diagnostics","runSystemDiagnostics")
.addItem("System Summary","showSystemSummary")

.addSeparator()

.addItem("Preview informal Speaker Invitation","previewInvitation")
.addItem("Send Invitations","sendInvitations")


// -----------------------------------------------------
// Letter Invitation System
// Menu
// -----------------------------------------------------
.addSeparator()
.addItem("Initialize Letter Sheet", "initializeLetterSheet_")
.addItem("Generate Letter for Active Row", "generateLetterForActiveRow")
.addItem("Generate All Pending Letters", "generateAllPendingLetters")
  
.addSeparator()

.addItem("Send Reminders","sendReminders")
.addItem("Send 7-Day Talk Reminders","sendTalkReminders7DaysManual")

.addSeparator()

.addItem("Preview Speaker Webpage","previewSpeakerWebpage")

.addItem("Preview Full Conference Website","previewConferenceWebsite")

.addSeparator()

.addItem("Generate Certificates","sendCertificates")
.addItem("Generate Program Booklet","generateProgramBooklet")
.addItem("Generate Speaker Badges","generateAllBadges")
.addItem("Generate Badge Sheets","generateBadgeSheets")

    
.addSeparator()
.addItem("Initialize Outreach Sheet", "initializeOutreachSheet_")
.addItem("Check Missing Outreach Columns", "showMissingOutreachColumnsReport")
.addItem("Add Missing Outreach Columns", "addMissingOutreachColumns_")
    



.addSeparator()
.addItem("Preview Outreach Email", "previewOutreachEmail")
.addItem("Send Selected Outreach Emails", "sendSelectedOutreachEmails")
.addItem("Send Pending Outreach Emails", "sendPendingOutreachEmails")

// .addItem("Check Outreach Columns","Outreach")


.addToUi();

}