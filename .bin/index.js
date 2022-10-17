#! /usr/bin/env node
const report          = require('../lib/report-generator');
const {createFolders} = require('js-packtools')();
const utils           = require('../utils');
const inquirer        = require('inquirer');
const {execSync}      = require('child_process');
let cmd               = `npx cypress --version`;
let strOut            = execSync(cmd);
let pathE2E           = undefined;

const getCypressVersion = (strOut) => {
    let binaryVersion = String(strOut).split('\n').filter(x => x.indexOf('Cypress binary version:') > -1)[0];
    console.log(binaryVersion);
    let version = binaryVersion.split(': ')[1].split('.')[0];
    if (Number(version) <= 9) {
        pathE2E = 'integration';
    } else if (Number(version) >= 10) {
        pathE2E = 'e2e';
    }
}
getCypressVersion(strOut);

console.log('--- Welcome to the generator Report ---');
const questions = [
    {
        type   : 'list',
        name   : 'options',
        message: utils.titleMini2+'\nYou have chosen the creation of:',
        choices: [
            '[1] - Generate list Features',
            '[2] - Generate list of Scenarios by Features',
            '[3] - Generate list of only Scenarios',
            '[4] - Generate Summary Table'],
    },
];
inquirer.prompt(questions).then(answers => {
        createFolders(utils.REPORT_PATH);

        if (answers.options === '[1] - Generate list Features') {
            report.report.reportListFeatures(pathE2E);
        }
        else if(answers.options === '[2] - Generate list of Scenarios by Features'){
            report.report.reportListScenariosByFeatures(pathE2E);
        }
        else if(answers.options === '[3] - Generate list of only Scenarios'){
            report.report.reportListScenarios(pathE2E);
        }
        else if (answers.options === '[4] - Generate Summary Table') {
            report.report.reportSummaryTable(pathE2E);
        }
        else{
            console.log('Select a option');
        }
    });