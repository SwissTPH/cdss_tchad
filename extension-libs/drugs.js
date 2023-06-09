function isDate(date_str) {
    return (date_str !== undefined && date_str!==null && new Date(date_str) !== 'Invalid Date') && !isNaN(new Date(date_str));
  }

/*
result format : https://docs.communityhealthtoolkit.org/apps/reference/extension-libs/
{
  "t": <type>,
  "v": <value>
}

 “bool”, “num”, “str”, “date”, or “arr”


 to call it 
 
 cht:extension-lib('drugs.js','hydro_a',${p_sel_gender}, ${date_naissance})

*/

const getValue = function(obj) {
    let val;
    if (obj.t === 'arr') {
      val = obj.v && obj.v.length && obj.v[0];
    } else {
      val = obj.v;
    }
    return val;
};


const getDateValue = function(obj) {
    val = getValue(obj);
    if (!val || !isDate(val.textContent)) {
        return null;
    }
    return new Date(val.textContent);
};

const getStrValue = function(obj) {
    val = getValue(obj);
    if (!val) {
        return null;
    }
    return val.textContent;
};

const getDecimalValue = function(obj) {
    val = getValue(obj);
    if (!val) {
        return null;
    }
    const parsed = parseFloat(val.textContent);
    return isNaN(parsed) ? 0 : parsed;
};
/*
field_dob  date
field_sex  String f or m
field_weight decimal in KG


*/

const result_null = { 't':'str','v':''};



const TREATMENTS = [

];



function getSlice(DICT,val){
    prev = 0;
    int_val = parseFloat(val);
    if (int_val !== ''){
        
        for (const [key, value] of Object.entries(DICT)) { 
            if (int_val < key){
                return prev;
            }
            prev  = value;
        }
    }
    return null
}


function getAgeInMonth(dob){
    return monthDiff(dob, new Date(Date.now()));
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

TREATMENTS['paracetamole_sirop'] =  function (age,sex,weight){
    let rate = 40; // 40 mg per kg
    let concentration  = 250 ; // 250 mg / ml
    if (weight>0){
        return {'t':'num', 'v': Math.round(rate * weight / concentration) };
    }
    ml = getSlice({
        2:3,
        4:5,
        12:8,
        36:10
       },age);
    if (ml === null){
        return result_null;
    }
    return {'t':'num', 'v':ml};

};


const HYDRO_A = {
    2: '50-100',
    24: '100-200',
   };

const HYDRO_B = {
    0:'200-400',
    4:'400-1000',
    12:'1000-1200',
    24:'1200-1900',
   };

   
   
   
   
TREATMENTS['vit_a'] = function (age,sex,weight){
    ml = getSlice({0:'2',
    6:'4',
    12:'8',
    },age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};
TREATMENTS['vit_a_2'] = function (age,sex,weight){
    ml = getSlice({0:'1/2',
    6:'1',
    12:'2',
    },age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};
TREATMENTS['vit_a_4'] = function (age,sex,weight){
    ml = getSlice({0:'1/4',
    6:'1/2',
    12:'1',
    },age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};
TREATMENTS['vit_a_6'] = function (age,sex,weight){
    ml = getSlice({0:'1',
    6:'2',
    12:'4',},age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};   
   


   
   

TREATMENTS['paracetamol_ml'] = function (age,sex,weight){
    ml = getSlice({0:'3',
    6:'5',
    10:'8',
    15:'10',                    
    },weight);
    if (ml === null){

        ml = getSlice({2:'3',
        4:'5',
        12:'8',
        36:'10',                              
        },age);
        if (ml === null){
            return result_null;
        }result_null
    }
    return {'t':'str', 'v':ml};
};  
TREATMENTS['paracetamol_tab'] = function (age,sex,weight){
    ml = getSlice({0:'--',
    6:'1/4',
    10:'1/4',
    15:'1/2',                        
    },weight);
    if (ml === null){

        ml = getSlice({0:'--',
        4:'1/4',
        12:'1/4',
        36:'1/2',                             
        },age);
        if (ml === null){
            return result_null;
        }
    }
    return {'t':'str', 'v':ml};
};  
TREATMENTS['iron_tab'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    10:'1/2',
    15:'1/2',                      
    },weight);
    if (ml === null){

        ml = getSlice({12:'0',
        36:'1/2',
        61:'1/2',                       
        },age);
        if (ml === null){
            return result_null;
        }
    }
    return {'t':'str', 'v':ml};
};    
TREATMENTS['iron_ml'] = function (age,sex,weight){
    ml = getSlice({0:'1.00 (<1/4 c.à.c)',
    6:'1.25 (1/4 c.à.c)',
    10:'2.00 (<1/2 c.à.c)',
    15:'2.5 (1/2 c.à.c)',                  
    },weight);
    if (ml === null){

        ml = getSlice({0:'--',2:'1.00 (<1/4 c.à.c)',
        4:'1.25 (1/4 c.à.c)',
        12:'2.00 (<1/2 c.à.c)',
        36:'2.5 (1/2 c.à.c)',
                      
        },age);
        if (ml === null){
            return result_null;
        }
    }
    return {'t':'str', 'v':ml};
};    
   

TREATMENTS['rutf_sam'] = function (age,sex,weight){
    ml = getSlice({0:'-',
    3.5:'1.5',
    4:'2',
    5:'2.5',
    7:'3',
    8.5:'3.5',
    9.5:'4',
    10.5:'4.5',
    12:'5',                               
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};      

   
TREATMENTS['cotrimoxazole_ml'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    4:'2',
    6:'3.5',
    10:'6',
    15:'8.5',                
    },weight);
    if (ml === null){
        ml = getSlice({0:'0',
        2:'2',
        4:'3.5',
        12:'6',
        36:'8.5',               
        },age);
        if (ml === null){
            return result_null;
        } 
    }
    return {'t':'str', 'v':ml};
};      

TREATMENTS['cotrimoxazole_tab'] = function (age,sex,weight){
    ml = getSlice({0:'--',
    4:'1/4',
    6:'1/2',
    10:'1',
    15:'1',                    
    },weight);
    if (ml === null){

        ml = getSlice({0:'--',
        2:'1/4',
        4:'1/2',
        12:'1',
        36:'1',        
        },age);
        if (ml === null){
            return result_null;
        }
    }
    return {'t':'str', 'v':ml};
};   

TREATMENTS['arthemeter_lumefantrine'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    3:'1',
    5:'1',
    15:'2',
    25:'3',                           
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};      

TREATMENTS['as_25_aq_67_tab'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    4.5:'1',
    9:'2',
    18:'4',
    36:'8',                        
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};   
   
TREATMENTS['as_50_aq_135'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    4.5:'1/2',
    9:'1',
    18:'2',
    36:'4',                    
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};

   
   
TREATMENTS['as_100_aq_270_tab'] = function (age,sex,weight){
        ml = getSlice({0:'0',
        4.5:'0',
        9:'0',
        18:'1',
        36:'2',                
        },weight);
        if (ml === null){
            return result_null;
        }
        return {'t':'str', 'v':ml};
    };

    TREATMENTS['diazepam_ml'] = function (age,sex,weight){
        ml = getSlice({0:'0',
        3:'2',
        6:'3.75',
        10:'6',
        15:'8.5',
        20:'12.5',
        },weight);
        if (ml === null){
    
            ml = getSlice({0:'0',
            2:'2',
            5:'3.75',
            12:'6',
            36:'8.5',
            61:'12.5',             
            },age);
            if (ml === null){
                return result_null;
            }
        }
        return {'t':'str', 'v':ml};
    };    

    TREATMENTS['phenobarbital_15_ml'] = function (age,sex,weight){
        ml = getSlice({0:'0.4',
        6:'0.6',
        10:'1',
        15:'1.5',
        20:'2',
                             
        },weight);
        if (ml === null){
    
            ml = getSlice({0:'0.4',
            5:'0.6',
            12:'1',
            36:'1.5',
            60:'2',
                   
            },age);
            if (ml === null){
                return result_null;
            }
        }
        return {'t':'str', 'v':ml};
    };    

    TREATMENTS['phenobarbital_5_ml'] = function (age,sex,weight){
        ml = getSlice({0:'0.1',
        6:'0.2',
        10:'0.4',
        15:'0.5',
        20:'0.7',
                      
        },weight);
        if (ml === null){
    
            ml = getSlice({0:'0.1',
            5:'0.2',
            12:'0.4',
            36:'0.5',
            60:'0.7',
                
            },age);
            if (ml === null){
                return result_null;
            }
        }
        return {'t':'str', 'v':ml};
    };    

   
TREATMENTS['quinine_iv_ml'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    3:'2',
    6:'3',
    10:'4',
    12:'5',
    14:'6',
    20:'10',                
    },weight);
    if (ml === null){

        ml = getSlice({0:'0',
        2:'2',
        4:'3',
        12:'4',
        24:'5',
        36:'6',
        60:'10',        
        },age);
        if (ml === null){
            return result_null;
        }
    }
    return {'t':'str', 'v':ml};
};      
TREATMENTS['artesunate_iv_ml'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    3:'1.2',
    6:'2.2',
    10:'2.8',
    12:'3.6',
    15:'4.6',        
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};   
TREATMENTS['artemether_im_ml'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    3:'0.1',
    6:'0.2',
    10:'0.25',
    12:'0.3',
    15:'0.4',    
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};
   
TREATMENTS['artesunate_im_ml'] = function (age,sex,weight){
    ml = getSlice({0:'0',
    3:'0.6',
    6:'1.1',
    10:'1.4',
    12:'1.8',
    15:'2.3',
    },weight);
    if (ml === null){
        return result_null;
    }
    return {'t':'stdobr', 'v':ml};
};

TREATMENTS['zinc'] = function (age,sex,weight){
    ml = getSlice({2:'1/2',6:'1'},age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};

TREATMENTS['hydro_a'] = function (age,sex,weight){
        ml = getSlice(HYDRO_A,age);
        if (ml === null){
            return result_null;
        }
        return {'t':'str', 'v':ml};
};

TREATMENTS['hydro_b'] = function (age,sex,weight){
    ml = getSlice(HYDRO_B,age);
    if (ml === null){
        return result_null;
    }
    return {'t':'str', 'v':ml};
};

module.exports = function(str_treatment, field_sex, field_age,field_weight ) {
    //collect data
    let sex = getStrValue(field_sex);
    let age = getDecimalValue(field_age); //getAgeInMonth(getDateValue(field_dob))
    let weight = getDecimalValue(field_weight);
    if (age === null || sex === null || str_treatment  === undefined|| str_treatment === '' ){
        return result_null;
    }
    //swich treatement

    obj =  TREATMENTS[str_treatment.v](age,sex,weight);
    //console.log('treatment for '+str_treatment.v + ': age '+ age+', sex' + sex +', weight ' +weight + ' -> ' + obj.t +': '+ obj.v )
    return obj;
}