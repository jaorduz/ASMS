
function buildSessionParts_(startDate){

  if(!CONFIG.SESSION_STRUCTURE || !CONFIG.SESSION_STRUCTURE.enabled){
    return [];
  }

  const parts = CONFIG.SESSION_STRUCTURE.parts;

  let current = new Date(startDate.getTime());

  return parts.map(p=>{

    const start = new Date(current.getTime());

    const end = new Date(current.getTime() + p.duration*60000);

    current = end;

    return {
      label: p.label,
      start,
      end
    };

  });

}

/*==========*/

function buildScheduleData_(){

const {records} = getData_();

/* only confirmed speakers */

const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus) === "Confirmed"
);

/* convert rows */

const sessions = confirmed.map(r=>{

const start = parseDateTime_(r.DateTalk,r.TimeStartTalk);

return {

start,
date:r.DateTalk,
time:r.TimeStartTalk,
title:r.TopicGral,
speaker:r.speakerName+" "+r.speakerLastName,
institution:r.institution || "",
zoomLink: formatValue_(r["zoomLink"]),
promo: formatValue_(r["PromotionalText"]),
calendarId:r.__rowNumber

};

});

/* sort sessions */

sessions.sort((a,b)=>a.start-b.start);

return sessions;

}


/*======= BUILD HTML schedule table ======*/

function buildScheduleHtml_(){

const sessions = buildScheduleData_();

if(!sessions.length){
return "<p>No confirmed sessions yet.</p>";
}

let html = `
<table class="schedule">

<tr>
<th>Time</th>
<th>Session</th>
<th>Speaker</th>
<th>Join</th>
</tr>
`;

sessions.forEach(s=>{

const startDate = s.start;

const parts = buildSessionParts_(startDate);

const zoom =
s.zoomLink
? `<a class="zoom-link" href="${s.zoomLink}" target="_blank">Join</a>`
: "";


/* ============================= */
/* CASE 1: NORMAL SESSION */
/* ============================= */

if(!parts.length){

html += `
<tr>

<td>${escapeHtml_(s.time)}</td>

<td class="talk-title">
${escapeHtml_(s.title)}
</td>

<td>
${escapeHtml_(s.speaker)}<br>
<span style="font-size:12px;color:#666">
${escapeHtml_(s.institution)}
</span>
</td>

<td>${zoom}</td>

</tr>
`;

}

/* ============================= */
/* CASE 2: THREE-PART SESSION */
/* ============================= */

else{

html += `
<tr>
<td colspan="4" class="talk-title">
${escapeHtml_(s.title)}
</td>
</tr>
`;

parts.forEach(p=>{

const timeStr =
Utilities.formatDate(p.start, Session.getScriptTimeZone(), "HH:mm") +
" - " +
Utilities.formatDate(p.end, Session.getScriptTimeZone(), "HH:mm");

html += `
<tr>

<td>${timeStr}</td>

<td>
${escapeHtml_(p.label)}
</td>

<td>
${escapeHtml_(s.speaker)}
</td>

<td>${zoom}</td>

</tr>
`;

});

}

/* DESCRIPTION (same for both cases) */

html += `
<tr>
<td colspan="4" class="session-description">
${escapeHtml_(s.promo)}
</td>
</tr>
`;

});

html += "</table>";

return html;

}


