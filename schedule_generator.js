// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz
// -----------------------------------------------------


function buildScheduleHtml_(){

const {records} = getData_();

const confirmed = records.filter(r =>
normalizeConfirmationStatus_(r.confirmationStatus)=="Confirmed"
);


// sort by time
confirmed.sort((a,b)=>{

const d1 = parseDateTime_(a.DateTalk,a.TimeStartTalk);
const d2 = parseDateTime_(b.DateTalk,b.TimeStartTalk);

return d1-d2;

});


// group by date
const grouped = {};

confirmed.forEach(r=>{

const date = formatDateForDisplay_(r.DateTalk);

if(!grouped[date]) grouped[date]=[];

grouped[date].push(r);

});


let html = "";

Object.keys(grouped).forEach(date=>{

html += `<h2>${date}</h2>`;

html += `<table class="schedule">`;

html += `
<tr>
<th>Time</th>
<th>Speaker</th>
<th>Talk</th>
</tr>
`;

grouped[date].forEach(r=>{

const name =
escapeHtml_(r.speakerName+" "+r.speakerLastName);

const time =
formatTimeForDisplay_(r.TimeStartTalk);

const topic =
escapeHtml_(r.TopicGral);

html += `
<tr>
<td>${time}</td>
<td>${name}</td>
<td>${topic}</td>
</tr>
`;

});

html += "</table>";

});

return html;

}