const { injectDataFromForm } = require('./stph-extras.js');


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

var CPN_FORMS = [
        'cpn'
      ];

function generateCpnContext(ctx){
    injectDataFromForm(ctx,'cpn_',CPN_CASE_DATA, CPN_FORMS,reports);
}

module.exports = {
    generateCpnContext
};