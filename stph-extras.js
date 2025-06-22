function injectDataFromForm(ctx, prefix,list_data, list_forms, report_list = [], remove_dots = false){
  var case_datas = initDatas(report_list, list_data, list_forms);
  //console.log(case_datas.length);
  // add the entry in the context only if there is a value
  Object.entries(case_datas).forEach(([key, value]) => {
      if (value !== null ){
      //  console.log('ctx['+prefix+key+']='+value);
        final_key = remove_dots ? (prefix+key).replace(/\./g, '_') : prefix+key
        ctx[final_key]=value;
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

  function isFormArrayHasSourceId(report,reports, event, dueDate, FORMS) {
    const startTime = Math.max(addDays(dueDate, -event.start).getTime(), report.reported_date);
    const endTime = addDays(dueDate, event.end + 1).getTime();
    const matchingReports = reports
        .filter((c_report) => FORMS.includes(c_report.form))
        .filter((c_report) => c_report.reported_date >= startTime && c_report.reported_date <= endTime)
        .filter((c_report) => getField(c_report, 'source_id') === report._id);
    return matchingReports.length > 0;
  }


  function addDatas(result, nodes, datas_list, parent_trail=[], max_depth = 0) {
    if  (max_depth == 0){
        const counts = datas_list.map(value => {
          if (typeof value !== 'string') return 0; // Handle non-string values
          return (value.match(/\./g) || []).length; // Count ". " occurrences
      });
      // Find the maximum count
      max_depth = Math.max(...counts) +1;
    }
    // reset parent trail if many child
    parent_trail = Object.entries(nodes).length == 1 ? parent_trail : []
    for (const [key, value] of Object.entries(nodes)) {
      const full_path = [...parent_trail, key]
         // Build the full path array
      cur_max_depth = Math.min(max_depth, full_path.length)
      // Skip invalid or unwanted keys
      if (isNaN(key) && value !== null && value !== undefined && key !== 'meta' && key !== undefined) {
          // Check if this key is explicitly in datas_list (leaf node, even if it has dots)
         
          if (datas_list.includes(key)) {
              result[key] = value; // Directly add it, no recursion needed
          }
          // Handle max_depth > 1: Check partial paths
          
          else if (typeof value === 'object' && Object.getOwnPropertyNames(value).length > 0) {
              result = addDatas(result, value, datas_list, full_path, max_depth);
          }
          else if (cur_max_depth > 1) {
              // Loop from 1 to max_depth to build partial keys from the end
              for (let i = 2; i <= cur_max_depth; i++) {
                  const part_key = full_path.slice(-i).join('.'); // Join last i elements with dots
                  if (datas_list.includes(part_key)) {
                      result[part_key] = value; // Add it if it matches datas_list
                  }
              }
              // Optionally store the full path (if needed, uncomment below)
              // result[full_path.join('.')] = value;
          }

          // Only recurse if it's an object with properties and NOT in datas_list

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
    truncateDecimals,
    isFormArrayHasSourceId
  };
