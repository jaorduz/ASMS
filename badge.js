function generateBadge(record){

const name =
formatValue_(record.speakerName) + " " +
formatValue_(record.speakerLastName);

const institution =
formatValue_(record.institution || "");

const topic =
formatValue_(record.TopicGral || "");

// ----------------------------------
// QR link priority
// ----------------------------------

const social =
record.speakerLinkedin ||
record.speakerWebsite ||
"";

let qrImage = "";

if(social){

qrImage =
"https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
encodeURIComponent(social);

}

// ----------------------------------
// Create badge document
// ----------------------------------

const doc = DocumentApp.create("badge_" + sanitizeFilename_(name));

const body = doc.getBody();

body.clear();

// ----------------------------------
// A7 layout styling
// ----------------------------------

body.appendParagraph(CONFIG.EVENT.name)
.setHeading(DocumentApp.ParagraphHeading.HEADING2)
.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

body.appendParagraph("")
.setSpacingAfter(10);

body.appendParagraph(name)
.setBold(true)
.setFontSize(18)
.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

if(institution){

body.appendParagraph(institution)
.setFontSize(12)
.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

}

body.appendParagraph("")
.setSpacingAfter(10);

if(topic){

body.appendParagraph(topic)
.setFontSize(11)
.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

}

body.appendParagraph("");


// ----------------------------------
// Insert QR code if exists
// ----------------------------------

if(qrImage){

const response = UrlFetchApp.fetch(qrImage);

const blob = response.getBlob();

body.appendImage(blob)
.setWidth(120)
.setHeight(120);

}


// ----------------------------------
// Save PDF in event folder
// ----------------------------------

doc.saveAndClose();

const pdf = DriveApp
.getFileById(doc.getId())
.getAs("application/pdf");

const eventFolder = getEventFolder_();

let badgesFolder;

const folders = eventFolder.getFoldersByName("badges");

if(folders.hasNext()){
badgesFolder = folders.next();
}else{
badgesFolder = eventFolder.createFolder("badges");
}

const filename =
"badge_" + sanitizeFilename_(name) + ".pdf";

const file =
badgesFolder.createFile(pdf).setName(filename);

// remove temporary doc
DriveApp.getFileById(doc.getId()).setTrashed(true);

return file;

}