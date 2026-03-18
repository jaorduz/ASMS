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
.addItem("Setup Application Form","setupApplicationFormForActiveEvent_")


.addSeparator()
.addItem("Check Missing Columns","showMissingColumnsReport")
.addItem("Add Missing Columns","addMissingColumns_")

.addSeparator()

.addItem("Preview Invitation","previewInvitation")
.addItem("Send Invitations","sendInvitations")

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
.addItem("System Diagnostics","runSystemDiagnostics")
.addItem("System Summary","showSystemSummary")



.addToUi();

}