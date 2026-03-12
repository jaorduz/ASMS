// -----------------------------------------------------
// ASMS - Advanced System for Meetings Support
// Conference automation platform
// Author: Javier Orduz

// ASMS Version: 1.0
// Maintainer: Dr. Javier Orduz

// ASMS Form Generator
// Creates confirmation form automatically

// -----------------------------------------------------

function createConfirmationForm_(eventName, language) {

const form = FormApp.create(
eventName + " – Speaker Confirmation"
);

/* Basic description */

if(language === "ES"){

form.setDescription(
"Formulario para confirmar participación como ponente."
);

} else {

form.setDescription(
"Form to confirm participation as a speaker."
);

}

/* Email */

form.addTextItem()
.setTitle("Email")
.setRequired(true);

/* Participation confirmation */

const confirm = form.addMultipleChoiceItem();

if(language === "ES"){

confirm.setTitle("¿Confirma su participación?")
.setChoices([
confirm.createChoice("Sí"),
confirm.createChoice("No"),
confirm.createChoice("Necesito más información")
])
.setRequired(true);

} else {

confirm.setTitle("Do you confirm participation?")
.setChoices([
confirm.createChoice("Yes"),
confirm.createChoice("No"),
confirm.createChoice("Need more information")
])
.setRequired(true);

}

/* Institution */

form.addTextItem()
.setTitle(
language === "ES"
? "Institución"
: "Institution"
);

/* Department */

form.addTextItem()
.setTitle(
language === "ES"
? "Departamento"
: "Department"
);

/* Invitation letter */

const letter = form.addMultipleChoiceItem();

if(language === "ES"){

letter.setTitle(
"¿Requiere carta formal de invitación?"
)
.setChoices([
letter.createChoice("Sí"),
letter.createChoice("No")
]);

}else{

letter.setTitle(
"Do you require an official letter of invitation?"
)
.setChoices([
letter.createChoice("Yes"),
letter.createChoice("No")
]);

}

/* Return form */

return form;

}