// -----------------------------------------------------
// Letter Invitation System
// Template helpers
// -----------------------------------------------------

function getLetterField_(record, field){
  return String(record[field] || "").trim();
}

function extractGoogleId_(url){
  const match = String(url || "").match(/[-\w]{25,}/);
  return match ? match[0] : "";
}

function getLetterLanguage_(record){
  const lang = getLetterField_(record, "language").toUpperCase();
  return lang || LETTER_CONFIG.defaultLanguage;
}

function getLetterTemplateUrl_(record){
  const lang = getLetterLanguage_(record);

  if(lang === "EN"){
    return getLetterField_(record, "templateDocUrlEN");
  }

  return getLetterField_(record, "templateDocUrlES");
}

function buildRecipientTitle_(record){
  const lang = getLetterLanguage_(record);
  const grade = getLetterField_(record, "academicGrade");
  const gender = getLetterField_(record, "gender");
  const firstName = getLetterField_(record, "firstName");
  const lastName = getLetterField_(record, "lastName");
  const fullName = getLetterField_(record, "fullName");

  const resolvedName = fullName || `${firstName} ${lastName}`.trim();

  if(lang === "EN"){
    return `${grade} ${resolvedName}`.trim();
  }

  // Spanish: you may adapt this later if you want Sr./Sra./Dr./Dra.
  return `${grade} ${resolvedName}`.trim();
}

function getLetterReplacementMap_(record){
  return {
    "{{FIRST_NAME}}": getLetterField_(record, "firstName"),
    "{{LAST_NAME}}": getLetterField_(record, "lastName"),
    "{{FULL_NAME}}": getLetterField_(record, "fullName"),
    "{{RECIPIENT_TITLE}}": buildRecipientTitle_(record),
    "{{EMAIL}}": getLetterField_(record, "email"),
    "{{INSTITUTION}}": getLetterField_(record, "institution"),
    "{{DEPARTMENT}}": getLetterField_(record, "department"),
    "{{POSITION_TITLE}}": getLetterField_(record, "positionTitle"),
    "{{ACADEMIC_GRADE}}": getLetterField_(record, "academicGrade"),
    "{{GENDER}}": getLetterField_(record, "gender"),
    "{{LANGUAGE}}": getLetterLanguage_(record),
    "{{EVENT_NAME}}": getLetterField_(record, "eventName"),
    "{{EVENT_DATE}}": getLetterField_(record, "eventDate"),
    "{{EVENT_TIME}}": getLetterField_(record, "eventTime"),
    "{{EVENT_LOCATION}}": getLetterField_(record, "eventLocation"),
    "{{EVENT_FORMAT}}": getLetterField_(record, "eventFormat"),
    "{{TALK_TITLE}}": getLetterField_(record, "talkTitle"),
    "{{EVENT_DESCRIPTION}}": getLetterField_(record, "eventDescription"),
    "{{HOST_NAME}}": getLetterField_(record, "hostName"),
    "{{HOST_TITLE}}": getLetterField_(record, "hostTitle"),
    "{{HOST_INSTITUTION}}": getLetterField_(record, "hostInstitution"),
    "{{SIGNATURE_NAME}}": getLetterField_(record, "signatureName"),
    "{{SIGNATURE_TITLE}}": getLetterField_(record, "signatureTitle")
  };
}