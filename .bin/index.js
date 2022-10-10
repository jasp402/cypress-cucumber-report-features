#! /usr/bin/env node
const report = require('../report-base');
const table  = require('../report-table');
const inquirer = require('inquirer');

console.log('The CLI is working 🚀');

const questions = [
    {
        type   : 'list',
        name   : 'report',
        message: 'You have chosen the creation of:',
        choices: ['base', 'Table of Scenarios'],
    },
];

inquirer.prompt(questions)
    .then(answers => {
        console.info('Answer:', answers);
        if (answers.report === 'base') {
            report.report.createReportBase();
        }
        else if (answers.report === 'Table of Scenarios') {
            report.report.createReportTable();
        }
    });