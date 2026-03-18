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
  const description =
`Speaker: ${formatValue_(record.speakerName)} ${formatValue_(record.speakerLastName)}

Topic:
${formatValue_(record.TopicGral)}

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

let events = "";

confirmed.forEach(r=>{

const start = parseDateTime_(r.DateTalk,r.TimeStartTalk);

if(!start) return;

const duration = parseDurationMinutes_(r.LastingTalk);

const end = new Date(start.getTime() + duration*60000);

const title = formatValue_(r.TopicGral);

const speaker =
formatValue_(r.speakerName) + " " + formatValue_(r.speakerLastName);

const zoom = r.zoomLink || "";

events += `
BEGIN:VEVENT
UID:${Utilities.getUuid()}
DTSTAMP:${Utilities.formatDate(new Date(),"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${Utilities.formatDate(start,"UTC","yyyyMMdd'T'HHmmss'Z'")}
DTEND:${Utilities.formatDate(end,"UTC","yyyyMMdd'T'HHmmss'Z'")}
SUMMARY:${escapeIcsText_(title)}
DESCRIPTION:${escapeIcsText_("Speaker: " + speaker)}
URL:${escapeIcsText_(zoom)}
END:VEVENT
`;

});

const calendar =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ASMS//Conference//EN
${events}
END:VCALENDAR
`;

return Utilities.newBlob(
calendar,
"text/calendar",
"conference_schedule.ics"
);

}