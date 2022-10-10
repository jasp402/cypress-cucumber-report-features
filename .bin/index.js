#! /usr/bin/env node
const report     = require('../report-generator');
const inquirer   = require('inquirer');
const {execSync} = require('child_process');
let cmd          = `npx cypress --version`;
let strOut       = execSync(cmd);
let pathE2E      = undefined;

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
        name   : 'report',
        message: 'You have chosen the creation of:',
        choices: ['base', 'Table of Scenarios'],
    },
];
inquirer.prompt(questions).then(answers => {
        console.info('Answer:', answers);
        if (answers.report === 'base') {
            report.report.createReportBase(pathE2E);
        }
        else if (answers.report === 'Table of Scenarios') {
            report.report.createReportTable();
        }
    });