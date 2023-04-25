var now = Date.now();

var pregnancyForms = [
];

var CPN_FORMS = [
  'cpn'
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

var CPN_CASE_DATA = [
'p_faf',
'p_moustiquaire',
'p_tpi',
'p_deparasitage',
'p_conseils',
'p_hygiene',
'p_info',
'p_ptme',
'p_vih',
'p_autre_mesr',
's_saignement',
's_leucorrhee',
's_perte',
's_cephale',
's_convulsion',
's_respiration',
's_essoufflement',
's_fievre',
's_douleur',
's_mains',
's_toux',
's_pertes_vaginales',
's_contraction_uterine',
's_rupture_poche',
's_lieu_accouche',
'lieu_accouche',
's_moyen_transport',
'moyen_transport',
's_economie',
's_preneurs_decisions',
'preneurs_decisions',
's_donneurs_sang',
'donneurs_sang',
's_id_accompagnate',
'id_accompagnate_note',
's_necessaires',
'diabete',
'drepanocytose',
'cardiopathie',
'hypertension_ateriel',
'tuberculose',
'autre',
'sign_antecedent',
'p_int_cpn',
'date_cpn_1',
'missed_cpn_1',
'date_cpn_2',
'missed_cpn_2',
'date_cpn_3',
'missed_cpn_3',
'date_cpn_4',
'missed_cpn_4',
'date_cpn_5',
'missed_cpn_5',
'date_cpn_6',
'missed_cpn_6',
'date_cpn_7',
'missed_cpn_7',
'date_cpn_8',
'missed_cpn_8',
'r_test_grossesse',
't_test_grossesse',
'affi_method',
'ddr_date',
'dpa_date',
'no_info_pregnancy_reason',
'age_estima',
'label_esti',
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
  return (date_str !== undefined && date_str!==null && new Date(date_str) !== 'Invalid Date') && !isNaN(new Date(date_str));
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
/*
const initChildImmunizations = function(allReports) {
  return initImmunizations(allReports, IMMUNIZATION_CHILD_DOSES, IMMUNIZATION_CHILD_FORMS);
};*/
function initDatas(allReports, datas_list, forms_list) {
  var master = {};
  datas_list.forEach(function(data) {
    master[data[0]] = null;
  });
  var i;
  // loop over all reports
  for(i=0; i<allReports.length; ++i) {
    const report = allReports[i];
    if(report && forms_list.includes(report.form) && report.fields){
        master = addDatas(master,  report.fields, datas_list);
    }

  }
  return master;
}


function getAgeInYears() {
  var birthDate, ageInMs;
  if (contact.date_of_birth && contact.date_of_birth !== '') {
    birthDate = new Date(contact.date_of_birth);
    ageInMs = new Date(Date.now() - birthDate.getTime());
    return (Math.abs(ageInMs.getFullYear() - 1970)) ;
  }
}

function dateFormat(datestr, iso=false){
  let objectDate = new Date(datestr);
  let day = objectDate.getDate();
  let month = objectDate.getMonth()+1;
  let year = objectDate.getFullYear();
  if (iso){
    return `${year}-${month}-${day}`;

  }else{
    return `${day}/${month}/${year}`;

  }
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



function generateDataContext(ctx, prefix,list_data, list_forms){
  var case_datas = initDatas(allReports, list_data, list_forms);
  console.log(case_datas.length);
  // add the entry in the context only if there is a value
  Object.entries(case_datas).forEach(([key, value]) => {
      if (value !== null ){
        console.log(prefix+key+':'+value);
        ctx[prefix+key]=value;
      }
  });
}

var generateWomenContext =  function (ctx){
  generateImmContext(ctx,IMMUNIZATION_WOMEN_DOSES, IMMUNIZATION_WOMEN_FORMS );
  generateDataContext(ctx,'cpn_',CPN_CASE_DATA, CPN_FORMS );
  
};


var generateChildContext =  function (ctx){
  generateImmContext(ctx,IMMUNIZATION_CHILD_DOSES, IMMUNIZATION_CHILD_FORMS );

};




// add the date only if found on the master and has value in report_path
var addImmunizations = function(master, report_path, doses_list) {
  doses_list.forEach(function(dose) {
    if(!master[dose[0]] && hasValue(report_path['date_' + dose[0]])) {
      master[dose[0]] = Date.parse(report_path['date_' + dose[0]]);
    }
  });
};


// add the date only if found on the master and has value in report_path

function addDatas(result, nodes, datas_list){
  for (const [key, value] of Object.entries(nodes)) {
    if(isNaN(key) && value !== null && value !== undefined && key !== 'meta' && key !== undefined ){
      console.log('read'+':'+key+':'+(typeof value)+':'+value);
      if( typeof value === 'object' && Object.getOwnPropertyNames(value).length > 0){
          console.log('dd'+':'+key+':'+(typeof value)+':'+value);
          result = addDatas(result,value,datas_list);
      }else if (key.trim() in datas_list || key === 'p_int_cpn'){
        console.log('add'+':'+key+':'+(typeof value)+':'+value);
        result[key]=(value);
      }
    }
  }
  return result;
}

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
  generateImmContext,
  getAgeInYears,
  getImmChildFileds,
  getImmWomenFileds,
};
