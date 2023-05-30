const {generateIMCIContent, TASK_FORM, IMCI_FORMS, IMCIresolveIf, } = require('./imci-task');


module.exports = [

    {
        name: 'tchad_form_pause',
        icon: 'icon-followup-general',
        title: 'Continue after lab',
        appliesTo: 'reports',
        appliesToType: IMCI_FORMS,
        actions: [
            {
                type: 'report',
                form: TASK_FORM,
                modifyContent: generateIMCIContent
            }
        ],
        events: [
            {
                id: 'tchad_form_pause',
                days: 1,
                start: 1,
                end: 0
            }
        ],
        resolvedIf: IMCIresolveIf
    }
];