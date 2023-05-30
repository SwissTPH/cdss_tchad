const { injectDataFromForm } = require('./contact-summary-extras.js')

var CPON_CASE_DATA = [
]
var CPON_FORMS = [
    'cpon'
  ];


var generateCponContext =  function (ctx){
    injectDataFromForm(ctx,'cpon_',CPON_CASE_DATA, CPON_FORMS, reports );
};

module.exports = {
    generateCponContext,

};