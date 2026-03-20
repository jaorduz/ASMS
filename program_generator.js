// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------



// -----------------------------------------------------
// PROGRAM BOOKLET GENERATOR
// Generates an HTML program listing all confirmed talks
// -----------------------------------------------------

function saveFileToFolder_(folder, filename, blob, mode){

  const existing = folder.getFilesByName(filename);

  if(existing.hasNext()){

    const file = existing.next();

    if(mode === "skip"){
      return file;
    }

    if(mode === "overwrite"){
      file.setTrashed(true);
    }
  }

  blob.setName(filename);
  return folder.createFile(blob);
}

//Function called helper 

function getOrCreateSubfolder_(parentFolder, name){

  const folders = parentFolder.getFoldersByName(name);

  if(folders.hasNext()){
    return folders.next();
  }

  return parentFolder.createFolder(name);
}

// function

function saveOrUpdateCalendarFile_(mode){

  const eventFolder = getEventFolder_();
  const programFolder = getOrCreateSubfolder_(eventFolder,"program");

  const filename = "conference_schedule.ics";

  const blob = generateConferenceCalendar_();

  return saveFileToFolder_(
    programFolder,
    filename,
    blob,
    mode // "overwrite" or "skip"
  );

}



// function
function generateProgramBooklet(){

  const schedule = buildScheduleHtml_();

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>

body{
font-family: "Helvetica Neue", Arial, sans-serif;
margin:50px;
color:#222;
}

h1{
color:#0f3d75;
font-size:32px;
margin-bottom:5px;
}

h2{
color:#444;
margin-bottom:30px;
}

.schedule{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

.schedule th{
background:#0f3d75;
color:white;
padding:10px;
text-align:left;
}

.schedule td{
border-bottom:1px solid #ddd;
padding:10px;
font-size:14px;
}

</style>
</head>

<body>

<h1>${escapeHtml_(CONFIG.EVENT.name)}</h1>
<h2>Conference Program</h2>

${schedule}

</body>
</html>
`;

  /* ---------------------------------
  GET FOLDER
  --------------------------------- */

  const eventFolder = getEventFolder_();
  const programFolder = getOrCreateSubfolder_(eventFolder,"program");

  /* ---------------------------------
  ENSURE CALENDAR EXISTS (NO DUPLICATION)
  --------------------------------- */

  saveOrUpdateCalendarFile_("overwrite"); // only ensures existence

  /* ---------------------------------
  CREATE TEMP HTML
  --------------------------------- */

  const htmlBlob = Utilities.newBlob(
    html,
    "text/html",
    "program_temp.html"
  );

  const htmlFile = saveFileToFolder_(
    programFolder,
    "program_temp.html",
    htmlBlob,
    "overwrite"
  );

  Utilities.sleep(1200);

  /* ---------------------------------
  CREATE PDF
  --------------------------------- */

  const pdfBlob = htmlFile.getBlob().getAs(MimeType.PDF);

  saveFileToFolder_(
    programFolder,
    sanitizeFilename_(CONFIG.EVENT.name) + "_program.pdf",
    pdfBlob,
    "overwrite"
  );

  /* ---------------------------------
  CLEAN TEMP FILE
  --------------------------------- */

  htmlFile.setTrashed(true);

  SpreadsheetApp.getUi().alert(
    "Program generated successfully.\n\nPDF and calendar stored in /program"
  );
}