#! /usr/bin/env node
const report          = require('../lib/report-generator');
const {createFolders} = require('js-packtools')();
const utils           = require('../utils');
const package         = require('../package.json')

console.log(`--- Generator Report Version: ${package.version}`);
console.log(`${utils.titleMini2}\n`);

const questions   = [
    {
        type   : 'list',
        name   : 'projectType',
        choices: [
            '[1] - Cypress < v10',
            '[2] - Cypress ≥ v10',
            '[3] - Cypress-craft',
        ],
        message: `select the project platform:`,
        default: '[1] - Cypress'
    },
    {
        type   : 'list',
        name   : 'options',
        message: `You have chosen the creation of:'`,
        choices: [
            '[1] - Generate list Features',
            '[2] - Generate list of Scenarios by Features',
            '[3] - Generate list of only Scenarios',
            '[4] - Generate Summary Table'
        ],
        default: '[1] - Generate list Features'
    }
];
const projectType = {
    '[1] - Cypress < v10': 'integration',
    '[2] - Cypress ≥ v10': 'e2e',
    '[3] - Cypress-craft': 'tests',
};
const actions     = {
    '[1] - Generate list Features'                : (typeProject) => report.reportListFeatures(typeProject),
    '[2] - Generate list of Scenarios by Features': (typeProject) => report.reportListScenariosByFeatures(typeProject),
    '[3] - Generate list of only Scenarios'       : (typeProject) => report.reportListScenarios(typeProject),
    '[4] - Generate Summary Table'                : (typeProject) => report.reportSummaryTable(typeProject)
};

async function main() {
    const inquirer = await import('inquirer');
    const prompt   = inquirer.default.prompt;
    prompt(questions).then(answers => {
        createFolders(utils.REPORT_PATH);
        actions[answers.options](projectType[answers.projectType]);
    });
}

main();
