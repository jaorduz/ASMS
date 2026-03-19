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



function generateProgramBooklet(){

const schedule = buildScheduleHtml_();

Logger.log(schedule);

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


/* -------------------------------------------------
GET EVENT FOLDER
------------------------------------------------- */
Utilities.sleep(1000);

const eventFolder = getEventFolder_();

/* -------------------------------------------------
CREATE OR GET "program" SUBFOLDER
------------------------------------------------- */

let programFolder;

const folders = eventFolder.getFoldersByName("program");

if(folders.hasNext()){
programFolder = folders.next();
}else{
programFolder = eventFolder.createFolder("program");
}


/* -------------------------------------------------
CREATE TEMP HTML FILE
------------------------------------------------- */

const htmlBlob = Utilities.newBlob(
html,
"text/html",
"program.html"
);

const htmlFile = saveFileToFolder_(
  programFolder,
  "program_temp.html",
  htmlBlob,
  "overwrite"
);


/* -------------------------------------------------
CONVERT TO PDF
------------------------------------------------- */

Utilities.sleep(1500);

const pdfBlob = htmlFile.getBlob().getAs(MimeType.PDF);

// programFolder.createFile(
// pdfBlob.setName(
// sanitizeFilename_(CONFIG.EVENT.name) + "_program.pdf"
// )
// );

saveFileToFolder_(
  programFolder,
  sanitizeFilename_(CONFIG.EVENT.name) + "_program.pdf",
  pdfBlob,
  "overwrite"
);



/*====== */

const calendarBlob = generateConferenceCalendar_();

saveFileToFolder_(
  programFolder,
  "conference_schedule.ics",
  calendarBlob,
  "overwrite"
);

/* -------------------------------------------------
OPTIONAL: REMOVE HTML FILE
------------------------------------------------- */

htmlFile.setTrashed(true);

}