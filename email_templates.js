// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------


// -----------------------------------------------------
// EMAIL TEMPLATES
// This file contains HTML templates used for emails.
// Only formatting lives here — no sending logic.
// -----------------------------------------------------


/**
 * Builds the HTML invitation email sent to speakers.
 *
 * The function receives a `record` object containing
 * the spreadsheet row data.
 */
function buildHtmlInvitation_(record){

  // --------------------------------------------------
  // Extract values from spreadsheet
  // --------------------------------------------------

  const name = escapeHtml_(formatValue_(record.speakerName) + " " + formatValue_(record.speakerLastName));

  const topic = escapeHtml_(formatValue_(record.TopicGral));
  const why = escapeHtml_(formatValue_(record.WhyThisTopic));

  const date = formatDateForDisplay_(record.DateTalk);
  const time = formatTimeForDisplay_(record.TimeStartTalk);
  const duration = escapeHtml_(formatValue_(record.LastingTalk));


  // --------------------------------------------------
  // Build dynamic lists (avoid empty bullet points)
  // --------------------------------------------------

  const focusItems = [
    record.FocusA,
    record.FocusB,
    record.FocusC,
    record.FocusD
  ].map(x => formatValue_(x))
   .filter(Boolean)
   .map(x => `<li>${escapeHtml_(x)}</li>`)
   .join("");

  const questionItems = [
    record.GuidingQuestionA,
    record.GuidingQuestionB,
    record.GuidingQuestionC
  ].map(x => formatValue_(x))
   .filter(Boolean)
   .map(x => `<li>${escapeHtml_(x)}</li>`)
   .join("");


  // --------------------------------------------------
  // HTML TEMPLATE
  // Uses table layout for better email compatibility
  // --------------------------------------------------

  return `
<!DOCTYPE html>
<html>

<body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:25px">
<tr>
<td align="center">


<table width="650" cellpadding="0" cellspacing="0" border="0"
style="background:white;border-radius:10px;overflow:hidden">


<!-- HEADER -->

<tr>
<td style="background:#0f3d75;color:white;padding:25px">

<h2 style="margin:0">
${CONFIG.EVENT.name}
</h2>

<div style="opacity:.9;font-size:14px">
Invitation to Speak
</div>

</td>
</tr>


<!-- BODY -->

<tr>
<td style="padding:28px">


<p>
Dear <strong>${name}</strong>,
</p>

<p>
I hope you are well. We would be honored to invite you as a speaker for the
<strong>${CONFIG.EVENT.name}</strong>, a bilingual academic initiative designed
to support researchers in developing submission-ready manuscripts and
competitive research proposals.
</p>



<p>
We would be delighted if you could lead a
<strong>${duration}</strong>-minutes online session on:
</p>


<h3 style="color:#0f3d75;margin-bottom:8px">
${topic}
</h3>


<p>
<strong>Why this topic:</strong><br>
${why}
</p>



<table style="margin-top:10px">
<tr>
<td><strong>Date:</strong></td>
<td style="padding-left:10px">${escapeHtml_(date)}</td>
</tr>

<tr>
<td><strong>Time:</strong></td>
<td style="padding-left:10px">${escapeHtml_(time)}</td>
</tr>
</table>



<!-- Suggested Areas -->

<p style="margin-top:18px">
<strong>Suggested areas you may address include:</strong>
</p>

<ul>
${focusItems}
</ul>



<!-- Guiding Questions -->

<p>
<strong>You may also consider questions such as:</strong>
</p>

<ul>
${questionItems}
</ul>



<!-- Appreciation -->

<p>
<strong>As a token of appreciation we will provide:</strong>
</p>

<ul>
<li>Official certificate issued by FES Acatlán–UNAM</li>
<li>Promotion of your profile and research in event materials</li>
<li>Visibility among an international academic audience</li>
<li>Opportunities to expand research collaborations</li>
<li>Recording of your talk for your professional portfolio</li>
<li>Institutional recognition of your contribution</li>
</ul>



<p>
If you require an <strong>official letter of invitation</strong>,
you may indicate this in the confirmation form.
</p>



<p>
Please Click on the confirm participation button before
<strong>${CONFIG.EVENT.confirmDeadline}</strong>.
</p>



<!-- BUTTON -->

<p style="margin-top:18px">

<a href="${CONFIG.FORM.confirmation}" style="
background:#2c7be5;
color:white;
padding:12px 18px;
text-decoration:none;
border-radius:6px;
font-weight:bold">

Confirm Participation

</a>

</p>



<!-- SIGNATURE -->

<p style="margin-top:30px">

Warm regards,<br>

<strong>${CONFIG.ORGANIZER.name}</strong><br>

${CONFIG.ORGANIZER.title}<br>

${CONFIG.ORGANIZER.phone}

</p>


<p>

<a href="${CONFIG.ORGANIZER.meeting}" style="
background:#0f3d75;
color:white;
padding:10px 16px;
text-decoration:none;
border-radius:6px">

Schedule a Meeting

</a>

</p>


</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}