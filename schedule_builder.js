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

const zoom =
s.zoomLink
? `<a class="zoom-link" href="${s.zoomLink}" target="_blank">Join</a>`
: "";

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


// function buildScheduleHtml_(){

//     // Temporary
// console.log("Schedule builder loaded");

// const sessions = buildScheduleData_();

// if(!sessions.length){
// return "<p>No confirmed sessions yet.</p>";
// }

// let html = `
// <table class="schedule">
// <tr>
// <th>Time</th>
// <th>Session</th>
// <th>Speaker</th>
// <th>Join</th>
// </tr>
// `;

// sessions.forEach(s => {

// const zoomHtml = s.zoomLink
// ? `<a class="zoom-link" href="${s.zoomLink}" target="_blank" rel="noopener noreferrer">Join Session</a>`
// : `<span style="color:#999;">—</span>`;

// const promoHtml = s.promo
// ? `
// <tr>
// <td colspan="4" class="session-description">
// ${escapeHtml_(s.promo)}
// </td>
// </tr>
// `
// : "";

// html += `
// <tr>
// <td>${escapeHtml_(s.time)}</td>

// <td class="talk-title">
// ${escapeHtml_(s.title)}
// </td>

// <td>
// ${escapeHtml_(s.speaker)}<br>
// <span style="font-size:12px;color:#666;">
// ${escapeHtml_(s.institution)}
// </span>
// </td>

// <td>
// ${zoomHtml}
// </td>
// </tr>

// ${promoHtml}
// `;

// });

// html += `</table>`;

// return html;
// }

// -----------------------

// function buildScheduleHtml_(){

// const sessions = buildScheduleData_();

// if(!sessions.length){
// return "<p>No confirmed sessions yet.</p>";
// }

// let html = `
// <table class="schedule">

// <thead>
// <tr>
// <th>Time</th>
// <th>Session</th>
// <th>Speaker</th>
// <th>Join</th>
// </tr>
// </thead>

// <tbody>
// `;

// sessions.forEach(s=>{

// const zoomUrl = formatValue_(s.zoomLink);

// const zoom =
// zoomUrl
// ? `<a class="zoom-link" href="${zoomUrl}" target="_blank" rel="noopener noreferrer">Join Session</a>`
// : `<span style="color:#999;">No link</span>`;

// html += `
// <tr>

// <td>${escapeHtml_(s.time)}</td>

// <td class="talk-title">
// ${escapeHtml_(s.title)}
// </td>

// <td>
// ${escapeHtml_(s.speaker)}<br>
// <span style="font-size:12px;color:#666">
// ${escapeHtml_(s.institution)}
// </span>
// </td>

// <td>
// ${zoom}
// </td>

// </tr>

// <tr>
// <td colspan="4" class="session-description">
// ${escapeHtml_(s.promo)}
// </td>
// </tr>
// `;

// });

// html += `
// </tbody>
// </table>
// `;

// return html;

// }