// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz

// ASMS Form Generator
// Creates confirmation form automatically

// -----------------------------------------------------

function createConfirmationForm_(eventName, language) {

const form = FormApp.create(
eventName + " – Speaker Confirmation"
);

/* Basic description */

if(language === "ES"){

form.setDescription(
"Formulario para confirmar participación como ponente."
);

} else {

form.setDescription(
"Form to confirm participation as a speaker."
);

}

/* Email */

form.addTextItem()
.setTitle("Email")
.setRequired(true);

/* Participation confirmation */

const confirm = form.addMultipleChoiceItem();

if(language === "ES"){

confirm.setTitle("¿Confirma su participación?")
.setChoices([
confirm.createChoice("Sí"),
confirm.createChoice("No"),
confirm.createChoice("Necesito más información")
])
.setRequired(true);

} else {

confirm.setTitle("Do you confirm participation?")
.setChoices([
confirm.createChoice("Yes"),
confirm.createChoice("No"),
confirm.createChoice("Need more information")
])
.setRequired(true);

}

/* Institution */

form.addTextItem()
.setTitle(
language === "ES"
? "Institución"
: "Institution"
);

/* Department */

form.addTextItem()
.setTitle(
language === "ES"
? "Departamento"
: "Department"
);

/* Invitation letter */

const letter = form.addMultipleChoiceItem();

if(language === "ES"){

letter.setTitle(
"¿Requiere carta formal de invitación?"
)
.setChoices([
letter.createChoice("Sí"),
letter.createChoice("No")
]);

}else{

letter.setTitle(
"Do you require an official letter of invitation?"
)
.setChoices([
letter.createChoice("Yes"),
letter.createChoice("No")
]);

}

/* Return form */

return form;

}

/*=====================*/

function createApplicationForm_(eventName, language, eventFolder){

/* -------------------------------------------------
CREATE FOLDERS
------------------------------------------------- */

let applicationsFolder;
let uploadsFolder;

/* applications folder */
const folders = eventFolder.getFoldersByName("applications");

if(folders.hasNext()){
  applicationsFolder = folders.next();
}else{
  applicationsFolder = eventFolder.createFolder("applications");
}

/* uploads folder */
const uploadFolders = applicationsFolder.getFoldersByName("uploads");

if(uploadFolders.hasNext()){
  uploadsFolder = uploadFolders.next();
}else{
  uploadsFolder = applicationsFolder.createFolder("uploads");
}

/* -------------------------------------------------
CREATE FORM
------------------------------------------------- */

const form = FormApp.create(
eventName + " – Application Form"
);

/* Move form to applications folder */
const formFile = DriveApp.getFileById(form.getId());
applicationsFolder.addFile(formFile);
DriveApp.getRootFolder().removeFile(formFile);

/* Description */
form.setDescription(
language === "ES"
? "Formulario de aplicación al programa."
: "Application form for the program."
);

/* -------------------------------------------------
FIELDS
------------------------------------------------- */

/* Name */
form.addTextItem()
.setTitle("Name")
.setRequired(true);

/* Last Name */
form.addTextItem()
.setTitle("Last Name")
.setRequired(true);

/* Email */
form.addTextItem()
.setTitle("Institutional Email")
.setRequired(true);

/* Job Position */
const job = form.addMultipleChoiceItem();

job.setTitle("Job Position")
.setChoices([
job.createChoice("Professor"),
job.createChoice("Researcher"),
job.createChoice("Posdoct"),
job.createChoice("Student"),
job.createChoice("Other")
])
.setRequired(true);

/* File Upload */
form.addTextItem()
.setTitle(
  language === "ES"
    ? "Liga a tu carta de aplicación (PDF en Google Drive)"
    : "Link to your application letter (PDF in Google Drive)"
)
.setHelpText(
  language === "ES"
    ? "Sube tu PDF a Google Drive, activa 'Cualquier persona con el enlace' y pega aquí la liga."
    : "Upload your PDF to Google Drive, set sharing to 'Anyone with the link', and paste the link here."
)
.setRequired(true);

/* -------------------------------------------------
RETURN OBJECT
------------------------------------------------- */

return {
  form,
  uploadsFolder
};

}

/*===================*/

function setupApplicationFormForActiveEvent_(){

  const eventFolder = getEventFolder_();

  const eventName = PropertiesService
    .getScriptProperties()
    .getProperty("ASMS_EVENT_NAME") || CONFIG.EVENT.name;

  const language = PropertiesService
    .getScriptProperties()
    .getProperty("ASMS_LANGUAGE") || "EN";

  const applicationData = createApplicationForm_(eventName, language, eventFolder);

  const applicationForm = applicationData.form;
  const uploadsFolder = applicationData.uploadsFolder;

  const formFile = DriveApp.getFileById(applicationForm.getId())
    .setName(eventName + " — Application Form");

  eventFolder.addFile(formFile);
  DriveApp.getRootFolder().removeFile(formFile);

  const props = PropertiesService.getScriptProperties();

  props.setProperty("ASMS_EVENT_APPLICATION_FORM_ID", applicationForm.getId());
  props.setProperty("ASMS_EVENT_APPLICATION_FORM_URL", applicationForm.getPublishedUrl());
  props.setProperty("ASMS_EVENT_APPLICATION_UPLOAD_FOLDER_ID", uploadsFolder.getId());

  SpreadsheetApp.getUi().alert(
    "Application form created and linked for the active event."
  );
}