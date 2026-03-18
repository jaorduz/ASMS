// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------



function getOrCreateSubfolder_(parentFolder, subfolderName){

  const folders = parentFolder.getFoldersByName(subfolderName);

  if(folders.hasNext()){
    return folders.next();
  }

  return parentFolder.createFolder(subfolderName);
}


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

// -----------------------------------------------------
// PROGRAM BOOKLET GENERATOR
// Generates an HTML program listing all confirmed talks
// -----------------------------------------------------



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

.talk-title{
font-weight:bold;
color:#0f3d75;
}

.zoom-link{
color:#2c7be5;
text-decoration:none;
font-weight:bold;
}

.session-description{
background:#fafafa;
padding:14px;
font-size:14px;
line-height:1.6;
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

  const eventFolder = getEventFolder_();
  const programFolder = getOrCreateSubfolder_(eventFolder, "program");

  const baseName = sanitizeFilename_(CONFIG.EVENT.name);
  const htmlFilename = baseName + "_program.html";
  const pdfFilename = baseName + "_program.pdf";
  const icsFilename = "conference_schedule.ics";

  /* TEMP HTML */
  const htmlBlob = Utilities.newBlob(html, "text/html", htmlFilename);
  const htmlFile = saveFileToFolder_(programFolder, htmlFilename, htmlBlob, "overwrite");

  Utilities.sleep(1200);

  /* PDF */
  const pdfBlob = htmlFile.getBlob().getAs(MimeType.PDF);
  saveFileToFolder_(programFolder, pdfFilename, pdfBlob, "overwrite");

  /* ICS */
  const calendarBlob = generateConferenceCalendar_();
  saveFileToFolder_(programFolder, icsFilename, calendarBlob, "overwrite");

  /* remove temp html from visible folder if you do not want it */
  htmlFile.setTrashed(true);

  SpreadsheetApp.getUi().alert(
    "Program booklet generated.\n\nFiles saved in the 'program' folder."
  );
}