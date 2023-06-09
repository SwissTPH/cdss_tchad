const { injectDataFromForm } = require('./stph-extras.js');

var CPON_CASE_DATA = [
'p_int_ref',
'p_int_cpon',
'date_accouchement',
'date_cpon_1',
'missed_cpon_1',
'date_cpon_2',
'missed_cpon_2',
'date_cpon_3',
'missed_cpon_3'
];

var CPON_FORMS = [
    'cpon'
  ];


function generateCponContext(ctx){
    injectDataFromForm(ctx,'cpon_',CPON_CASE_DATA, CPON_FORMS, reports );

}

module.exports = {
    generateCponContext
};