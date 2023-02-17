const extras = require('./contact-summary-extras');
const {immunizationForms, modifyImmContext,getImmFileds, isAlive } = extras;



//contact, reports, lineage are globally available for contact-summary
const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;

/*********  DEFAULT FIELDS *********/
const fields = [
  { appliesToType: 'person', label: 'patient_id', value: thisContact.patient_id, width: 4 },
  { appliesToType: 'person', label: 'contact.age', value: thisContact.date_of_birth, width: 4, filter: 'age' },
  { appliesToType: 'person', label: 'contact.sex', value: 'contact.sex.' + thisContact.sex, translate: true, width: 4 },
  { appliesToType: 'person', label: 'person.field.phone', value: thisContact.phone, width: 4 },
  { appliesToType: 'person', label: 'person.field.alternate_phone', value: thisContact.phone_alternate, width: 4 },
  { appliesToType: 'person', label: 'External ID', value: thisContact.external_id, width: 4 },
  { appliesToType: 'person', label: 'contact.parent', value: thisLineage, filter: 'lineage' },
  { appliesToType: '!person', label: 'contact', value: thisContact.contact && thisContact.contact.name, width: 4 },
  { appliesToType: '!person', label: 'contact.phone', value: thisContact.contact && thisContact.contact.phone, width: 4 },
  { appliesToType: '!person', label: 'External ID', value: thisContact.external_id, width: 4 },
  { appliesToType: '!person', appliesIf: function () { return thisContact.parent && thisLineage[0]; }, label: 'contact.parent', value: thisLineage, filter: 'lineage' },
  { appliesToType: 'person', label: 'contact.notes', value: thisContact.notes, width: 12 },
  { appliesToType: '!person', label: 'contact.notes', value: thisContact.notes, width: 12 }
];

if (thisContact.short_name) {
  fields.unshift({ appliesToType: 'person', label: 'contact.short_name', value: thisContact.short_name, width: 4 });
}

/*********  DEFAULT CONTEXT *********/

const context = {
  alive: isAlive(thisContact),
  muted: false
};

/*********  CARD DEFINITION *********/

const cards = [];

/*<<addcardhere>>*/

console.log('adding child card');
cards.push(
  {
    label: 'contact.profile.imm.child',
    appliesToType: 'report',
    appliesIf:   (report) => { return report && immunizationForms.includes(report.form);},
    fields:  getImmFileds(allReports),
    modifyContext: modifyImmContext,
  }
);

/*********  EXPORT *********/



module.exports = {
  fields: fields,
  cards: cards,
  context: context
};