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



function generateProgramBooklet(){

const schedule = buildScheduleHtml_();

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>

body{
font-family:Arial;
margin:40px;
}

h1{
color:#0f3d75;
}

h2{
margin-top:0;
color:#444;
}

.schedule{
width:100%;
border-collapse:collapse;
}

.schedule th,
.schedule td{
border:1px solid #ccc;
padding:8px;
}

.schedule th{
background:#0f3d75;
color:white;
}

</style>
</head>

<body>

<h1>${CONFIG.EVENT.name}</h1>
<h2>Conference Program</h2>

${schedule}

</body>
</html>
`;


/* -------------------------------------------------
GET EVENT FOLDER
------------------------------------------------- */

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

const htmlFile = programFolder.createFile(htmlBlob);


/* -------------------------------------------------
CONVERT TO PDF
------------------------------------------------- */

const pdfBlob = htmlFile.getBlob().getAs("application/pdf");

programFolder.createFile(
pdfBlob.setName("program.pdf")
);


/* -------------------------------------------------
OPTIONAL: REMOVE HTML FILE
------------------------------------------------- */

htmlFile.setTrashed(true);

}