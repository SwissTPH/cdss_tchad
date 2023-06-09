const { isReportValid, getAgeInYears, dateFormat, isDate,
  hasValue,  getBirthDate, count} = require('./stph-extras');
const {isAlive} = require('./nools-extra');
const {generateCponContext} = require('./contact-summary-cpon');
const {generateCpnContext} = require('./contact-summary-cpn');
var now = Date.now();

var pregnancyForms = [
];



var deliveryForms = [
];

var postnatalForms = [
];

var IMMUNIZATION_CHILD_FORMS = [
  'pev_enfant',
];

var IMMUNIZATION_WOMEN_FORMS = [
  'pev_femme',
];

var IMMUNIZATION_WOMEN_DOSES = [
  ['vat1', 'vat1'],
  ['vat2', 'vat2'],
  ['vat3', 'vat3'],
  ['vat4', 'vat4'],
  ['vat5', 'vat5'],
];

var IMMUNIZATION_WOMEN_LIST = [
  'vat',
];

var MS_IN_DAY = 24*60*60*1000;  // 1 day in ms
var MAX_DAYS_IN_PREGNANCY = 44*7;  // 44 weeks
var DAYS_IN_PNC = 45; // Allow for 3 extra days to receive PNC reports

var IMMUNIZATION_CHILD_DOSES = [
  ['bcg', 'bcg'],
  ['vpo0', 'vpo0'],
  ['vpo1', 'vpo1'],
  ['vpo2', 'vpo2'],
  ['vpo3', 'vpo3'],
  ['penta1', 'penta1'],
  ['penta2', 'penta2'],
  ['penta3', 'penta3'],
  ['vpi', 'vpi'],
  ['var', 'var'],
  ['vaa', 'vaa'],
  ['meni', 'meni'],
  ['vita', 'vita'],
  ['meb', 'meb'],
];

var IMMUNIZATION_CHLID_LIST = [
  'bcg',
  'vpo',
  'penta',
  'vpi',
  'var',
  'vaa',
  'meni',
  'vita',
  'meb',
];


// from rules.nools.js https://github.com/medic/medic-projects/blob/4dafaeed547ea61d362662f136e1e1f7c7335e9c/standard/rules.nools.js#L219-L229
// modified to exclude invalid reports, which is common with SMS reports
function countReportsSubmittedInWindow(form, end) {
  return count(reports, function(r) {
    return r.reported_date <= end && form.indexOf(r.form) !== -1;
  });
}


// from nootils.js: https://github.com/medic/medic/blob/1cc25f2aeab60258065329bd1365ee1d316a1f50/static/js/modules/nootils.js
function addDate(date, days) {
  var result = new Date(date);
  date.setDate(result.getDate() + days);
  return date;
}

// Opposite of the following, with no form arg: https://github.com/medic/medic/blob/31762050095dd775941d1db3a2fc6f6b633522f3/static/js/modules/nootils.js#L37-L47
var getOldestReport = function(reports) {
  var result;
  reports.forEach(function(report) {
    if (!isReportValid(report)) { return; }
    if (!result || report.reported_date < result.reported_date) {
      result = report;
    }
  });
  return result;
};



function getAgeInMonths() {
  var birthDate, ageInMs;
  if (contact.date_of_birth && contact.date_of_birth !== '') {
    birthDate = new Date(contact.date_of_birth);
    ageInMs = new Date(Date.now() - birthDate.getTime());
    return (Math.abs(ageInMs.getFullYear() - 1970) * 12) + ageInMs.getMonth();
  }
}


/*<<addfcthere>>*/

/************** PEV ENFANT **************/

function initImmunizations(allReports, doses_list, forms_list) {
  var master = {};
  doses_list.forEach(function(dose) {
    master[dose[0]] = null;
  });
  var i;
  // loop over all reports
  for(i=0; i<allReports.length; ++i) {
    const report = allReports[i];
    if(report && forms_list.includes(report.form) && report.fields){
        addImmunizations(master, report.fields, doses_list);
    }

  }
  return master;
}



function getImmFileds(allReports, list_doses, list_forms, list_imm) {
  const fields = [];
  var immunizations = initImmunizations(allReports, list_doses, list_forms );
  list_imm.forEach(function(imm) {
    var field = {
      label: 'contact.imm.' + imm,
      translate: true,
      width: 6,
    };
    if (isSingleDose(imm,list_doses)) {

      field.value = hasValue(immunizations[imm]) && isDate(immunizations[imm]) ?  dateFormat(immunizations[imm]) : null;
    } else {

      let dose_recieved  = countDosesReceived(immunizations, imm, list_doses);
      field.value = 'faite: '+countDosesReceived(immunizations, imm, list_doses)
        + '\nattendue: '+countDosesPossible(imm, list_doses);
      if (dose_recieved>0) field.value += '\ndernière: '+dateFormat(getMaxDose(immunizations, imm));

      
    }
    fields.push(field);
  });
  return fields;
}


const getImmChildFileds = function (allReports) { return getImmFileds(allReports,IMMUNIZATION_CHILD_DOSES,IMMUNIZATION_CHILD_FORMS, IMMUNIZATION_CHLID_LIST);};
const getImmWomenFileds = function (allReports) { return getImmFileds(allReports,IMMUNIZATION_WOMEN_DOSES,IMMUNIZATION_WOMEN_FORMS, IMMUNIZATION_WOMEN_LIST);};

const allReports = reports;


function generateImmContext(ctx,list_doses, list_forms){
  var immunizations = initImmunizations(allReports, list_doses, list_forms);
  // add the entry in the context only if there is a value
  Object.entries(immunizations).forEach(([key, value]) => {
      
      if (value !== null ){
          //console.log('imm_date_'+key+':'+value+dateFormat(value));
        ctx['imm_date_'+key]=isDate(value) ? dateFormat(value, true):value;
      }
  });
}



var generateWomenContext =  function (ctx){
  generateImmContext(ctx,IMMUNIZATION_WOMEN_DOSES, IMMUNIZATION_WOMEN_FORMS );
  generateCpnContext(ctx);
  generateCponContext(ctx);

  
};


var generateChildContext =  function (ctx){
  generateImmContext(ctx,IMMUNIZATION_CHILD_DOSES, IMMUNIZATION_CHILD_FORMS );

};




// add the date only if found on the master and has value in report_path
var addImmunizations = function(master, report_path, doses_list) {
  doses_list.forEach(function(dose) {
    if(!master[dose[0]] && hasValue(report_path['date_' + dose[0]])) {
      master[dose[0]] = Date.parse(report_path['date_' + dose[0]]);
      console.log('addimmu ' + dose[0] + ':'+ master[dose[0]]);
    }
  });
};



// count the number of time there is name_ in the "master" list with a value
function getMaxDose(master, name) {
    var filtered = getImmSubList(master, name);
    return Object.keys(filtered).length >0 ? (Math.max.apply(null,
      Object.keys(filtered).map(function(key){return filtered[key];})
    )): null;
}

// count the number of time there is name_ in the "master" list with a value
var countDosesReceived = function(master, name, doses_list ) {
  return count(doses_list, function(dose) {
    return master[dose[0]] && dose[0].indexOf(name) === 0;
  });
};
// count the number of time there is name_ in the "master" list 
function countDosesPossible(name, doses_list) {
  return count(doses_list, function(dose) {
    return dose[0].indexOf(name ) === 0;
  });
}

var isSingleDose = function(name, doses_list) {
  // Single doses wont be followed by an underscore in the list of doses
  return doses_list.some(function(d) {
    return d[0] === name;
  });
};

function getImmSubList(master, name) {
  return Object.fromEntries(Object.entries(master).filter(([key, value]) => key.indexOf(name) === 0 && isDate(value)));
}

module.exports = {
  now,
  pregnancyForms,
  deliveryForms,
  postnatalForms,
  MS_IN_DAY,
  MAX_DAYS_IN_PREGNANCY,
  DAYS_IN_PNC,
  generateWomenContext,
  generateChildContext,
  count,
  getBirthDate,
  isReportValid,
  countReportsSubmittedInWindow,
  addDate,
  isDate,
  isAlive,
  getOldestReport,
  getAgeInMonths,
  generateImmContext,
  getAgeInYears,
  getImmChildFileds,
  getImmWomenFileds,
};
