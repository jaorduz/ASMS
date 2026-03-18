// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------


// -----------------------------------------------------
// CALENDAR UTILITIES
// This file generates .ICS calendar invitations
// that can be attached to speaker emails.
// -----------------------------------------------------



function buildSessionPartsText_(startDate){

  if(!CONFIG.SESSION_STRUCTURE || !CONFIG.SESSION_STRUCTURE.enabled){
    return "";
  }

  const parts = CONFIG.SESSION_STRUCTURE.parts;

  let current = new Date(startDate.getTime());

  let lines = [];

  parts.forEach(p=>{

    const start = new Date(current.getTime());
    const end = new Date(current.getTime() + p.duration*60000);

    const timeStr =
      Utilities.formatDate(start, Session.getScriptTimeZone(), "HH:mm") +
      "-" +
      Utilities.formatDate(end, Session.getScriptTimeZone(), "HH:mm");

    lines.push(`${timeStr} ${p.label}`);

    current = end;

  });

  return lines.join("\\n");
}


/**
 * Escapes text so it is safe for ICS calendar format.
 */
function escapeIcsText_(str) {

  return String(str || "")
  .replace(/\\/g, "\\\\")
  .replace(/\n/g, "\\n")
  .replace(/,/g, "\\,")
  .replace(/;/g, "\\;");

}



/**
 * Builds an ICS calendar file for a speaker session.
 *
 * This allows speakers to add the event directly to:
 * - Google Calendar
 * - Outlook
 * - Apple Calendar
 */
function buildIcsBlob_(record) {


  // ---------------------------------------------
  // Parse session start time
  // ---------------------------------------------
  const startDate = parseDateTime_(record.DateTalk, record.TimeStartTalk);

  if (!startDate) return null;



  // ---------------------------------------------
  // Calculate end time using session duration
  // ---------------------------------------------
  const durationMinutes = parseDurationMinutes_(record.LastingTalk);

  const endDate = new Date(
    startDate.getTime() + durationMinutes * 60000
  );



  // ---------------------------------------------
  // Determine meeting link
  // (Zoom link if provided, otherwise Calendly)
  // ---------------------------------------------
  const meetingLink =
    record.zoomLink || CONFIG.ORGANIZER.meeting;



  // ---------------------------------------------
  // Event title
  // ---------------------------------------------
  const summary =
    `${CONFIG.EVENT.name} — ${formatValue_(record.TopicGral)}`;



  // ---------------------------------------------
  // Event description
  // ---------------------------------------------
const sessionParts =
buildSessionPartsText_(startDate);

const description =
`Speaker: ${record.speakerName} ${record.speakerLastName}

Topic:
${record.TopicGral}

${sessionParts ? "Session Structure:\\n" + sessionParts + "\\n\\n" : ""}

Join link:
${meetingLink}

Organizer:
${CONFIG.ORGANIZER.name}
`;


  // ---------------------------------------------
  // Unique calendar event ID
  // ---------------------------------------------
  const uid = Utilities.getUuid();



  // ---------------------------------------------
  // ICS calendar structure
  // Compatible with Google / Outlook / Apple
  // ---------------------------------------------
  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FES Acatlan UNAM//Bootcamp//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${Utilities.formatDate(new Date(),"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${Utilities.formatDate(startDate,"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTEND:${Utilities.formatDate(endDate,"UTC","yyyyMMdd'T'HHmmss'Z'")}
SUMMARY:${escapeIcsText_(summary)}
DESCRIPTION:${escapeIcsText_(description)}
LOCATION:Online
URL:${meetingLink}
END:VEVENT
END:VCALENDAR`;



  // ---------------------------------------------
  // Return ICS file as attachment
  // ---------------------------------------------
  return Utilities.newBlob(
    ics,
    "text/calendar",
    "session.ics"
  );

}

/**========= */

function generateConferenceCalendar_(){

const {records} = getData_();

const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) === "Confirmed"
);

/* prevent duplicates */
const seen = new Set();

let events = "";

confirmed.sort((a,b)=>{
  const d1 = parseDateTime_(a.DateTalk,a.TimeStartTalk);
  const d2 = parseDateTime_(b.DateTalk,b.TimeStartTalk);
  return d1 - d2;
});

confirmed.forEach(r=>{

const start = parseDateTime_(r.DateTalk,r.TimeStartTalk);
if(!start) return;

const duration = parseDurationMinutes_(r.LastingTalk);
const end = new Date(start.getTime() + duration*60000);

/* unique key to avoid duplicates */
const key =
r.DateTalk + "_" +
r.TimeStartTalk + "_" +
r.speakerName + "_" +
r.TopicGral;

if(seen.has(key)) return;
seen.add(key);

/* STABLE UID (important) */
const uid =
Utilities.base64Encode(
key
).replace(/[^a-zA-Z0-9]/g,"") + "@asms";

/* fields */
const title = formatValue_(r.TopicGral);

const speaker =
formatValue_(r.speakerName) + " " +
formatValue_(r.speakerLastName);

const zoom = formatValue_(r.zoomLink);

/* OPTIONAL SESSION STRUCTURE */
const sessionParts =
buildSessionPartsText_(start);

/* description */
let description =
`Speaker: ${speaker}\\n\\n`;

if(sessionParts){
description += `Session Structure:\\n${sessionParts}\\n\\n`;
}

if(zoom){
description += `Join link:\\n${zoom}`;
}

/* event */
events += `
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${Utilities.formatDate(new Date(),"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${Utilities.formatDate(start,"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTEND:${Utilities.formatDate(end,"UTC","yyyyMMdd'T'HHmmss'Z'")}
SUMMARY:${escapeIcsText_(title)}
DESCRIPTION:${escapeIcsText_(description)}
LOCATION:Online
URL:${escapeIcsText_(zoom)}
END:VEVENT
`;

});

/* CALENDAR NAME (very important for UX) */
const calendarName = escapeIcsText_(CONFIG.EVENT.name);

const calendar =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ASMS//Conference//EN
X-WR-CALNAME:${calendarName}
${events}
END:VCALENDAR
`;

return Utilities.newBlob(
calendar,
"text/calendar",
"conference_schedule.ics"
);

}