// -----------------------------------------------------
// ASMS official spreadsheet schema
// -----------------------------------------------------

function getASMSRequiredColumns_(){
  return [
    "email",
    "speakerName",
    "speakerLastName",
    "TopicGral",
    "FocusA",
    "FocusB",
    "FocusC",
    "FocusD",
    "WhyThisTopic",
    "GuidingQuestionA",
    "GuidingQuestionB",
    "GuidingQuestionC",
    "DateTalk",
    "TimeStartTalk",
    "LastingTalk",
    "status",
    "confirmationStatus",
    "lastEmailSent",
    "lastReminderSent",
    "institution",
    "department",
    "notes",
    "speakerPhoto",
    "speakerBio",
    "zoomLink",
    "letterRequested",
    "talkReminder7Sent",
    "speakerLinkedin",
    "speakerWebsite",
    "speakerSummaryAI",
    "badgeIssued",
    "certificateIssued",
    "objectiveParticular",
    "PromotionalText"
  ];
}

function getMissingColumns_(){

  const sheet = getSheet_();
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]
    .map(h => String(h).trim());

  const required = getASMSRequiredColumns_();

  return required.filter(col => !headers.includes(col));
}