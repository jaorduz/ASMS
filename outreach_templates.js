// Step. 2

function getOutreachField_(record, field){
  return String(record[field] || "").trim();
}

function replaceTemplatePlaceholders_(template, record){

  return template.replace(/{{(.*?)}}/g, (_, key)=>{
    return getOutreachField_(record, key.trim()) || "";
  });

}

// HTML default template

function buildDefaultOutreachHtml_(record){

  const firstName = getOutreachField_(record,"firstName");
  const eventName = getOutreachField_(record,"eventName");
  const talkTitle = getOutreachField_(record,"talkTitle");
  const talkTime = getOutreachField_(record,"talkTime");
  const registration = getOutreachField_(record,"registrationFormUrl");
  const eventUrl1 = getOutreachField_(record,"eventUrl1");
  const eventUrl2 = getOutreachField_(record,"eventUrl2");
  const zoom = getOutreachField_(record,"zoomLink");
  const calendarIcsUrl = getOutreachField_(record,"calendarIcsUrl");
  

  return `
  <div style="
    font-family:Arial, sans-serif;
    max-width:600px;
    margin:auto;
    background:#ffffff;
    padding:24px;
    border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.05);
  ">

    <h2 style="color:#0b2e59; margin-bottom:10px;">
      ${eventName}
    </h2>

    <p style="font-size:15px;">
      Hello ${firstName || "there"},
    </p>

    <p style="font-size:15px; line-height:1.6;">
We are pleased to invite you to <strong>${eventName}</strong>, a bilingual English-Spanish 
outreach event designed to introduce people across the Americas to the fascinating 
world of quantum science and technology. Through engaging talks, live demonstrations, 
and interactive discussions, participants will explore key concepts such as qubits, 
superposition, quantum computing, communication, and cryptography — and discover why 
quantum science is shaping the future.
Ideal for: high school students, first-year university students, educators, 
Early-career academics, and interdisciplinary teams.
      </p>

    ${talkTitle ? `
    <div style="
      margin:20px 0;
      padding:16px;
      background:#f5f7fb;
      border-left:4px solid #1f4e8c;
      border-radius:6px;
    ">
      <strong>Featured Session</strong><br>
      ${talkTitle}<br>
      <span style="color:#555;">${talkTime}</span>
    </div>
    ` : ""}

    <p style="font-size:15px; line-height:1.6;">
      This program brings together researchers across disciplines to 
      transform ideas into structured, fundable projects aligned with 
      national and international priorities.
    </p>

    ${registration ? `
    <p>
    <a href="${registration}" style="
      display:inline-block;
      background:#1f4e8c;
      color:white;
      padding:10px 14px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
    ">Registration</a>
        Unlimited spots available.
    </p>
    ` : ""}

    ${zoom ? `
    <p>
    <a href="${zoom}" style="
      display:inline-block;
      background:#2563eb;
      color:white;
      padding:10px 14px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
    ">Join Session</a>
    Limited spots available — early applications are encouraged.
    </p>
    ` : ""}

    ${eventUrl1 ? `
    <p style="font-size:14px;">
      <a href="${eventUrl1}">Event Website</a>
    </p>
    ` : ""}

    ${eventUrl2 ? `
    <p style="font-size:14px;">
      <a href="${eventUrl2}">Additional Information</a>
    </p>
    ` : ""}


<p style="font-size:14px; color:#444;">
We recommend adding, and attaching this email, this event directly to your calendar.
</p>


    <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

    <p style="font-size:14px; color:#444;">
We would love to have you be part of this unique experience and join a 
vibrant, curious, and inspiring community of young quantum explorers 
from across the Americas.
      </p>

    <p style="font-size:14px;">
      Best regards,<br>
      <strong>${eventName} Team</strong>
    </p>

  </div>
  `;
}
// Subject generator:

function buildOutreachSubject_(record){

  const custom = getOutreachField_(record,"customSubject");
  const lang = getOutreachField_(record,"languageEmailEng").toUpperCase();

  if(custom){
    return replaceTemplatePlaceholders_(custom, record);
  }

  const eventName = getOutreachField_(record,"eventName");
  const talkTitle = getOutreachField_(record,"talkTitle");

  if(lang === "ES"){
    return talkTitle
      ? `${eventName} — ${talkTitle}`
      : `${eventName} — Invitación`;
  }

  return talkTitle
    ? `${eventName} — ${talkTitle}`
    : `${eventName} — Invitation`;
}

// final HTML 

function buildOutreachHtml_(record){

  const custom = getOutreachField_(record,"customMessage");
  const lang = getOutreachField_(record,"languageEmailEng").toUpperCase();

  if(custom){
    return replaceTemplatePlaceholders_(custom, record);
  }

  if(lang === "ES"){
    return buildDefaultOutreachHtml_ES_(record);
  }

  return buildDefaultOutreachHtml_(record); // default EN
}

// build plain text fallback

function buildOutreachPlainText_(record){

  const lang = getOutreachField_(record,"languageEmailEng").toUpperCase();
  const firstName = getOutreachField_(record,"firstName");
  const eventName = getOutreachField_(record,"eventName");
  const registration = getOutreachField_(record,"registrationFormUrl");

  if(lang === "ES"){
    return `
Hola ${firstName},

Te invitamos a ${eventName}.

${registration ? `Registro: ${registration}` : ""}

Saludos,
${eventName}
`;
  }

  return `
Hello ${firstName},

You are invited to ${eventName}.

${registration ? `Register: ${registration}` : ""}

Best regards,
${eventName}
`;
}
// Temporary function

function testOutreachTemplate_(){

  const {records} = getData_();
  const record = records[0];

  const html = buildOutreachHtml_(record);

  Logger.log(html);
}

// Spanish message

function buildDefaultOutreachHtml_ES_(record){

  const firstName = getOutreachField_(record,"firstName");
const eventName = getOutreachField_(record,"eventName");
const talkTitle = getOutreachField_(record,"talkTitle");
const talkTime = getOutreachField_(record,"talkTime");
const registration = getOutreachField_(record,"registrationFormUrl");
const eventUrl1 = getOutreachField_(record,"eventUrl1");
const eventUrl2 = getOutreachField_(record,"eventUrl2");
const zoom = getOutreachField_(record,"zoomLink");
const calendarIcsUrl = getOutreachField_(record,"calendarIcsUrl");
return `
  <div style="
    font-family:Arial, sans-serif;
    max-width:600px;
    margin:auto;
    background:#ffffff;
    padding:24px;
    border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.05);
  ">
    <h2 style="color:#0b2e59; margin-bottom:10px;">
${eventName}
    </h2>
    <p style="font-size:15px;">
      Hola ${firstName || "estimado/a"},
    </p>
    <p style="font-size:15px; line-height:1.6;">

El <strong>${eventName}</strong> es un evento bilingüe inglés-español enfocado en jóvenes, 
diseñado para despertar la curiosidad e inspirar a la próxima generación de pensadores 
cuánticos. Realizado completamente en línea, el IQDD conecta a estudiantes de todo el 
continente americano con destacados educadores, investigadores y referentes de la comunidad 
cuántica internacional.

Ya sea que estés descubriendo la ciencia cuántica por primera vez o que desees profundizar 
tu comprensión, el IQDD ofrece una experiencia accesible y enriquecedora para todos. 
A través de charlas inspiradoras, demostraciones educativas y discusiones interactivas, 
los participantes explorarán conceptos fascinantes como qubits, superposición, computación 
cuántica, comunicación cuántica y criptografía — y descubrirán por qué estos avances están 
transformando la ciencia, la tecnología y la sociedad.

Ideal para estudiantes de preparatoria, estudiantes de primer año universitario, docentes y 
cualquier persona curiosa sobre el mundo cuántico.   

    </p>
${talkTitle ? `
    <div style="
      margin:20px 0;
      padding:16px;
      background:#f5f7fb;
      border-left:4px solid #1f4e8c;
      border-radius:6px;
    ">
      <strong>Sesión Destacada</strong><br>
${talkTitle}<br>
      <span style="color:#555;">${talkTime}</span>
    </div>
    ` : ""}
    <p style="font-size:15px; line-height:1.6;">
      Este programa reúne a investigadores de diversas disciplinas para transformar ideas en proyectos estructurados y financiables, 
      alineados con las prioridades nacionales e internacionales.
    </p>
${registration ? `
    <p>
    <a href="${registration}" style="
      display:inline-block;
      background:#1f4e8c;
      color:white;
      padding:10px 14px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
    ">Registro</a>
        Lugares ilimitados disponibles.
    </p>
    ` : ""}
${zoom ? `
    <p>
    <a href="${zoom}" style="
      display:inline-block;
      background:#2563eb;
      color:white;
      padding:10px 14px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
    ">Unirse a la sesión</a>
    Lugares limitados disponibles — se recomienda aplicar con anticipación.
    </p>
    ` : ""}
${eventUrl1 ? `
    <p style="font-size:14px;">
      <a href="${eventUrl1}">Sitio web del evento</a>
    </p>
    ` : ""}
${eventUrl2 ? `
    <p style="font-size:14px;">
      <a href="${eventUrl2}">Información adicional</a>
    </p>
    ` : ""}
    
<p style="font-size:14px; color:#444;">
Se incluye un archivo de calendario adjunto para agregar el evento directamente a tu agenda.
</p>

    <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">
    <p style="font-size:14px; color:#444;">
    Nos encantaría que formaras parte de esta 
    experiencia única y que te unieras a una comunidad vibrante, curiosa e 
    inspiradora de jóvenes de todo el continente americano.  
    </p>
    <p style="font-size:14px;">
      Atentamente,<br>
      <strong>Equipo de ${eventName}</strong>
    </p>
  </div>
  `;
}