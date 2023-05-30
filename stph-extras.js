
function injectDataFromForm(ctx, prefix,list_data, list_forms, report_list = []){
    var case_datas = initDatas(report_list, list_data, list_forms);
    //console.log(case_datas.length);
    // add the entry in the context only if there is a value
    Object.entries(case_datas).forEach(([key, value]) => {
        if (value !== null ){
          //console.log(prefix+key+':'+value);
          ctx[prefix+key]=value;
        }
    });
  }

  function isReportValid(report) {
    return report && !(report.errors && report.errors.length);
  }

  /*
const initChildImmunizations = function(allReports) {
  return initImmunizations(allReports, IMMUNIZATION_CHILD_DOSES, IMMUNIZATION_CHILD_FORMS);
};*/
function initDatas(report_list, datas_list, forms_list) {
    var master = {};
    datas_list.forEach(function(data) {
      master[data[0]] = null;
    });
    var i;
    // loop over all reports
    for(i=0; i<report_list.length; ++i) {
      const report = report_list[i];
      if(report && forms_list.includes(report.form) && report.fields){
          master = addDatas(master,  report.fields, datas_list);
      }
  
    }
    return master;
  }
  
  // add the date only if found on the master and has value in report_path

function addDatas(result, nodes, datas_list){
    for (const [key, value] of Object.entries(nodes)) {
      if(isNaN(key) && value !== null && value !== undefined && key !== 'meta' && key !== undefined ){
        //console.log('read'+':'+key+':'+(typeof value)+':'+value);
        if( typeof value === 'object' && Object.getOwnPropertyNames(value).length > 0){
            //console.log('dd'+':'+key+':'+(typeof value)+':'+value);
            result = addDatas(result,value,datas_list);
        }else if (datas_list.includes(key)){
          //console.log('add'+':'+key+':'+(typeof value)+':'+value);
          result[key]=(value);
        }
      }
    }
    return result;
  }
  

function getAgeInYears(contact) {
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


  function getBirthDate(r) {
    var rawDate = r &&
        (r.birth_date || r.fields.birth_date || r.reported_date);
    return new Date(rawDate);
  }
  
  
  function hasValue(path){
    return path !== undefined && path !== null && path !== '';
  }
  
  


  
  function isDate(date_str) {
    return (date_str !== undefined && date_str!==null && new Date(date_str) !== 'Invalid Date') && !isNaN(new Date(date_str));
  }
  
  function count(arr, fn) {
    var c = 0;
    for(var i=0; i<arr.length; ++i) {
      if(fn(arr[i])) { ++c; }
    }
    return c;
  }
  //https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript

  function truncateDecimals (num, digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}


  module.exports = {
    dateFormat,
    getAgeInYears,
    addDatas,
    initDatas,
    isReportValid,
    injectDataFromForm,
    isDate,
    hasValue,
    getBirthDate, 
    count,
    truncateDecimals
  };
