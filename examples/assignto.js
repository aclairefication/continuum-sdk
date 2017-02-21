import sdk, { axiosConnector } from './../src';
import axios from 'axios'


const axiosConnectedSdk = axiosConnector(axios)(sdk);
const ctm = axiosConnectedSdk('localhost', 8080, 'http').withCreds('Administrator', 'Password1');


const testAssignTo = (response, assignees) => {
    const assigneeIncluded = (assignee) => response.data.Response[0].plugin.args.assignto.includes(assignee);
    return assignees.every(assigneeIncluded);
};


// project name, assignees on a pipeline, and the pipeline

const PROJECT = 'Project-1-for-testing';
const ASSIGN_TO = ['administrator'];
const PIPELINE = {
    'actions': [],
    'dependencies': [],
    'description': '',
    'globals': {},
    'interactive': true,
    'name': 'my-interactive-pipeline',
    'phases': [
        {
            'name': '',
            'stages': [
                {
                    'name': '',
                    'steps': [
                        {
                            'name': '',
                            'plugin': {
                                'args': {
                                    'assignto': ASSIGN_TO,
                                      'text': 'Yes or No?',
                                    'title': 'Confirm or Deny this.'
                                },
                                'kind': 'confirm',
                                'label': 'Flow - Interact - Confirmation',
                                'method': 'confirmation',
                                'module': 'interact',
                                'name': 'flow',
                                'type': 'interaction'
                            },
                            'tags': [],
                            'when': 'always'
                        }
                    ]
                }
            ]
        }
    ],
    'pipelineglobals': {},
    'summary': []
};


ctm.create('project', { name: PROJECT })
    .then(() => {

        ctm.impo('pipeline', { backup: PIPELINE })
            .then(() => {

                ctm.initiate('pipeline', {
                    definition: PIPELINE['name'],
                    project: PROJECT,
                    group: 'debug'
                }).then(response => {

                    const name = response.data.Response.name;

                    ctm.get('worklist', {
                        filter: name
                    }).then(response => {

                            const actual = testAssignTo(response, ASSIGN_TO);
                            console.log(`Pass: ${actual}`);

                        }).catch(console.log)
                }).catch(console.log)
                }).catch(console.log)
        }).catch(console.log);


// ctm.get('worklist', {})
//     .then(response => {
//         console.dir(response, {depth: null});
//         // const actual = testAssignTo(response, ASSIGN_TO);
//         // console.log(actual)
//     });

// ctm.initiate('pipeline', {
//     definition: PIPELINE['name'],
//     project: PROJECT,
//     group: 'debug2'
// }).then((response) => {
//
//     const id = response.data.Response._id;
//     console.dir(id, {depth: null});
//
//     ctm.get('worklist', {})
//         .then(response => {
//
//
//             const pipelineAssignees = response.data.Response.filter(pipeline_instance => {
//
//                 console.log('rc_id', pipeline_instance.rc_id)
//
//                 if(pipeline_instance.rc_id === id) {
//                     console.log('found')
//                 }
//             });
//
//         });
//
// });

// test('Assignees should be present in a pending pipeline', done => {
//
//     return ctm.get('worklist', {})
//         .then(response => {
//             // const actual = testAssignto(response, ASSIGN_TO);
//             expect(true).toEqual(true);
//             done()
//         }).catch(err => {
//             console.log(err)
//             expect(true).toEqual(true);
//             done()
//         })
// });

