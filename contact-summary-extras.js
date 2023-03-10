var now = Date.now();

var pregnancyForms = [
];

var antenatalForms = [
];

var deliveryForms = [
];

var postnatalForms = [
];

var immunizationForms = [
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

var IMMUNIZATION_DOSES = [
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

var IMMUNIZATION_LIST = [
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

function isReportValid(report) {
  return report && !(report.errors && report.errors.length);
}

function count(arr, fn) {
  var c = 0;
  for(var i=0; i<arr.length; ++i) {
    if(fn(arr[i])) { ++c; }
  }
  return c;
}




var isFacilityDelivery = function(r) {
  return r &&
         r.fields &&
         r.fields.delivery_code &&
         r.fields.delivery_code.toLowerCase() === 'f';
};

function isNonFacilityDelivery(r) {
  return r &&
         deliveryForms.indexOf(r.form) &&
         r.fields &&
         r.fields.delivery_code &&
         r.fields.delivery_code.toLowerCase() !== 'f';
}

function getBirthDate(r) {
  var rawDate = r &&
      (r.birth_date || r.fields.birth_date || r.reported_date);
  return new Date(rawDate);
}




function hasValue(path){
  return path !== undefined && path !== null && path !== '';
}

/*const getField = (report, fieldPath) => ['fields', ...(fieldPath || '').split('.')]
  .reduce((prev, fieldName) => {
    if (prev === undefined) { return undefined; }
    return prev[fieldName];
  }, report);*/


function isDate(date_str) {
  return (new Date(date_str) !== 'Invalid Date') && !isNaN(new Date(date_str));
}


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



function isAlive(thisContact) {
  return thisContact && !thisContact.date_of_death;
}

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

var initImmunizations = function(allReports, doses_list, forms_list) {
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
};




function getAgeInYears() {
    return Math.trunc(getAgeInMonths()/12);
}

const getImmFileds = function (allReports) {
  const fields = [];
  var immunizations = initImmunizations(allReports, IMMUNIZATION_DOSES, immunizationForms);
  IMMUNIZATION_LIST.forEach(function(imm) {
    var field = {
      label: 'contact.imm.' + imm,
      translate: true,
      width: 6,
    };
    if (isSingleDose(imm)) {

      field.value = hasValue(immunizations[imm]) && isDate(immunizations[imm]) ?  new Date(immunizations[imm]) : null;
    } else {
      field.value = 'contact.imm.doses';
      field.context = {
        count: countDosesReceived(immunizations, imm, IMMUNIZATION_DOSES),
        total: countDosesPossible(imm, IMMUNIZATION_DOSES),
        last: getMaxDose(immunizations, imm)
      };
    }
    fields.push(field);
  });
  return fields;
};


const allReports = reports;

var generateChildContext = function (ctx){
  var immunizations = initImmunizations(allReports, IMMUNIZATION_DOSES, immunizationForms);
  // add the entry in the context only if there is a value
  Object.entries(immunizations).forEach(([key, value]) => {
      
      if (value !== null ){
        //console.log('imm_date_'+key+':'+value);
        ctx['imm_date_'+key]=value;
      }
  });
  
};

var generateWomenContext = function (ctx){
  var immunizations = initImmunizations(allReports, IMMUNIZATION_WOMEN_DOSES, IMMUNIZATION_WOMEN_FORMS );
  // add the entry in the context only if there is a value
  Object.entries(immunizations).forEach(([key, value]) => {
      
      if (value !== null ){
        //console.log('imm_date_'+key+':'+value);
        ctx['imm_date_'+key]=value;
      }
  });
  
};

const getImmWomenFileds = function (allReports) {
  const fields = [];
  var immunizations = initImmunizations(allReports, IMMUNIZATION_WOMEN_DOSES, IMMUNIZATION_WOMEN_FORMS );
  IMMUNIZATION_WOMEN_LIST.forEach(function(imm) {
    var field = {
      label: 'contact.imm.' + imm,
      translate: true,
      width: 6,
    };
    if (isSingleDose(imm)) {

      field.value = hasValue(immunizations[imm]) && isDate(immunizations[imm]) ?  new Date(immunizations[imm]) : null;
    } else {
      field.value = 'contact.imm.doses';
      field.context = {
        count: countDosesReceived(immunizations, imm, IMMUNIZATION_WOMEN_DOSES),
        total: countDosesPossible(imm, IMMUNIZATION_WOMEN_DOSES),
        last: getMaxDose(immunizations, imm)
      };
    }
    fields.push(field);
  });
  return fields;
};



// add the date only if found on the master and has value in report_path
var addImmunizations = function(master, report_path, doses_list) {
  doses_list.forEach(function(dose) {
    if(!master[dose[0]] && hasValue(report_path['date_' + dose[0]])) {
      master[dose[0]] = report_path['date_' + dose[0]];
    }
  });
};
// count the number of time there is name_ in the "master" list with a value
function getMaxDose(master, name) {
    var filtered = getImmSubList(master, name);
    return filtered.length >0 ? new Date(Math.max.apply(null,filtered)): null;
}

// count the number of time there is name_ in the "master" list with a value
var countDosesReceived = function(master, name, doses_list ) {
  return count(doses_list, function(dose) {
    return master[dose[0]] && dose[0].indexOf(name + '_') === 0;
  });
};
// count the number of time there is name_ in the "master" list 
function countDosesPossible(name, doses_list) {
  return count(doses_list, function(dose) {
    return dose[0].indexOf(name + '_') === 0;
  });
}

var isSingleDose = function(name, doses_list) {
  // Single doses wont be followed by an underscore in the list of doses
  return doses_list.some(function(d) {
    return d[0] === name;
  });
};

function getImmSubList(master, name) {
  return Object.keys(master)
  .filter( key => key.includes('date_' + name))
  .reduce((obj, key) => {
    obj[key] = isDate(master[key]) ? new Date(master[key]):null;
    return obj;
  }, {});


}

module.exports = {
  now,
  pregnancyForms,
  antenatalForms,
  deliveryForms,
  postnatalForms,
  immunizationForms,
  MS_IN_DAY,
  MAX_DAYS_IN_PREGNANCY,
  DAYS_IN_PNC,
  IMMUNIZATION_DOSES,
  IMMUNIZATION_LIST,
  count,
  isFacilityDelivery,
  isNonFacilityDelivery,
  getBirthDate,
  isReportValid,
  countReportsSubmittedInWindow,
  addDate,
  isDate,
  isAlive,
  getOldestReport,
  getAgeInMonths,
  getAgeInYears,
  generateChildContext,
  generateWomenContext,
  getImmFileds,
  getImmWomenFileds,
};
