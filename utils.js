// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------


// -----------------------------------------------------
// UTILITY FUNCTIONS
// Reusable helpers used across the entire project
// -----------------------------------------------------



// -----------------------------------------------------
// BASIC VALUE FORMATTING
// -----------------------------------------------------

/**
 * Safely converts a value to a trimmed string.
 */
function formatValue_(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}



// -----------------------------------------------------
// DATE & TIME UTILITIES
// -----------------------------------------------------

/**
 * Parses spreadsheet date and time values into a Date object.
 * Handles multiple formats:
 *  - Date objects
 *  - "13:30"
 *  - "1:30 PM"
 *  - "1 PM"
 */
function parseDateTime_(dateValue, timeValue) {

  if (!dateValue) return null;

  let d;

  if (Object.prototype.toString.call(dateValue) === "[object Date]" && !isNaN(dateValue)) {
    d = new Date(dateValue);
  } else {
    d = new Date(dateValue);
    if (isNaN(d)) return null;
  }

  let hours = 9;
  let minutes = 0;

  if (Object.prototype.toString.call(timeValue) === "[object Date]" && !isNaN(timeValue)) {

    hours = timeValue.getHours();
    minutes = timeValue.getMinutes();

  } else {

    const t = formatValue_(timeValue);

    if (t) {

      const m12 = t.match(/(\d{1,2})[:.](\d{2})\s*(AM|PM)/i);
      const m12b = t.match(/(\d{1,2})\s*(AM|PM)/i);
      const m24 = t.match(/(\d{1,2})[:.](\d{2})/);

      if (m12) {

        hours = parseInt(m12[1], 10);
        minutes = parseInt(m12[2], 10);

        const mer = m12[3].toUpperCase();

        if (mer === "PM" && hours < 12) hours += 12;
        if (mer === "AM" && hours === 12) hours = 0;

      } else if (m12b) {

        hours = parseInt(m12b[1], 10);
        minutes = 0;

        const mer = m12b[2].toUpperCase();

        if (mer === "PM" && hours < 12) hours += 12;
        if (mer === "AM" && hours === 12) hours = 0;

      } else if (m24) {

        hours = parseInt(m24[1], 10);
        minutes = parseInt(m24[2], 10);

      }
    }
  }

  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0);
}



/**
 * Converts talk duration text into minutes.
 */
function parseDurationMinutes_(lastingTalk){

const s = formatValue_(lastingTalk).toLowerCase();

if(!s) return 60;

const num = s.match(/(\d+(\.\d+)?)/);
const value = num ? parseFloat(num[1]) : 60;

if(s.includes("hour") || s.includes("hr"))
return Math.round(value*60);

return Math.round(value);

}



/**
 * Returns whole number of days until a given date.
 */
function wholeDaysUntil_(futureDate){

const today = new Date();

const startOfToday =
new Date(today.getFullYear(),today.getMonth(),today.getDate());

const target =
new Date(futureDate.getFullYear(),futureDate.getMonth(),futureDate.getDate());

return Math.round(
(target.getTime()-startOfToday.getTime())/(1000*60*60*24)
);

}



/**
 * Days passed since a date.
 */
function daysSince_(dateValue){

const d = new Date(dateValue);

const now = new Date();

const diffMs = now.getTime() - d.getTime();

return diffMs / (1000 * 60 * 60 * 24);

}



/**
 * Format date for speaker webpage display.
 */
function formatDateForDisplay_(dateValue){

const d = parseDateTime_(dateValue,null);

if(!d) return "";

return Utilities.formatDate(
d,
CONFIG.TIMEZONE,
"MMMM d, yyyy"
);

}



/**
 * Format time for display.
 */
function formatTimeForDisplay_(timeValue){

if(!timeValue) return "";

if(Object.prototype.toString.call(timeValue)==="[object Date]" && !isNaN(timeValue)){

return Utilities.formatDate(
timeValue,
CONFIG.TIMEZONE,
"h:mm a"
);

}

return formatValue_(timeValue);

}



// -----------------------------------------------------
// STATUS NORMALIZATION
// -----------------------------------------------------

function normalizeConfirmationStatus_(value) {

const v = formatValue_(value).toLowerCase();

if (["yes","confirmed","confirm","accepted","accept"].includes(v))
return "Confirmed";

if (["no","declined","decline","rejected"].includes(v))
return "Declined";

if (["need more information","more information","pending",""].includes(v))
return "Pending";

return value ? String(value).trim() : "Pending";

}



// -----------------------------------------------------
// HTML SAFETY
// -----------------------------------------------------

function escapeHtml_(str){

return String(str || "")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;");

}



function escapeAttribute_(str){

return escapeHtml_(str).replace(/'/g,"&#39;");

}



// -----------------------------------------------------
// FILE UTILITIES
// -----------------------------------------------------

function sanitizeFilename_(str){

return String(str || "")
.replace(/[\\\/:*?"<>|]+/g,"_")
.replace(/\s+/g,"_")
.substring(0,80);

}



// -----------------------------------------------------
// SPREADSHEET UTILITIES
// -----------------------------------------------------

function getColumnIndexMap_(headers){

const map={};

headers.forEach((h,i)=>{

map[h]=i+1;

});

return map;

}



// -----------------------------------------------------
// BADGE GENERATION
// -----------------------------------------------------

/**
 * Generates badges for all confirmed speakers.
 */
function generateAllBadges(){

const {records}=getData_();

records.forEach(record=>{

if(normalizeConfirmationStatus_(record.confirmationStatus)!="Confirmed")
return;

generateBadge(record);

});

}

