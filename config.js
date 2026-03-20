// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz
// Institution: UNAM – FES Acatlán
// -----------------------------------------------------

// -----------------------
// Update information here
// -----------------------
const ASMS_VERSION = "1.0.0";

const CONFIG = {
  SPREADSHEET_ID: "1jnctNn12vFfgRjlpRe-r0xh_CbzW33s4TJgIibBMuso",

  // Use "test" while checking the workflow.
  // Change to "production" when ready to send real emails.
  SHEET_NAME: "production",

  EVENT: {
    code: "RAB2026",
    name: "International Quantum Discovery Day",//"Research Accelerator Bootcamp",
    webpageTitle: "International Quantum Discovery Day",//"Research Accelerator Bootcamp Speakers",
    confirmDeadline: "March 21, 2026"
  },

  ORGANIZER: {
    name: "Dr. Javier Orduz",
    title: "Secretario Académico de Investigación UIM",
    phone: "Tel: (+52) 55 5623 1750 Ext. 38903",
    meeting: "https://calendly.com/jaorduz"
  },

  FORM: {
    confirmation: "https://docs.google.com/forms/d/e/1FAIpQLSdMmuVhUy8I9kuGLKHSb9oWzrfBFqCJnMAjuu3L1faMpmla6g/viewform"
    //"https://docs.google.com/forms/d/1xt8K6_6QFShpiUYi4CYpnyzJ971BSvUhQf05ttdEhAI/viewform" //Bootcamp
  },

  TIMEZONE: "America/Mexico_City",

SPONSORS : [
  {
    name : "FES Acatlán",
    url  : "https://www.acatlan.unam.mx/",
    logo : "https://lh3.googleusercontent.com/d/1-NAsOiyrFVGa1eKv5hTacHdVT7R49SZ-"
  },
  {
    name : "QMexico",
    url  : "https://qmexico.org",
    logo : "https://qmexico.org/wp-content/uploads/2020/10/cropped-logo-long-7.png"
  },
  {
    name : "Qaldas",
    url  : "https://qaldas.com",
    logo : "https://lh3.googleusercontent.com/d/1pCWBRmvRGgBtdE7P9ocnykTh2um4zLfe"
  }
]

};