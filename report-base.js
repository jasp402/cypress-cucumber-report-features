#! /usr/bin/env node
const path                         = require('path');
const fs                           = require('fs');
const {clearFolder, createFolders} = require('js-packtools')();
const {AsciiTable3, AlignmentEnum} = require('ascii-table3');
const utils                        = require('./utils');
const yargs = require("yargs");

// const usage = "\nUsage: tran <lang_name> sentence to be translated";
// const options = yargs.usage(usage).option("l", {alias:"languages", describe: "List all supported languages.", type: "boolean", demandOption: false }).help(true).argv;

const ROOT_PATH            = __dirname + '/../../cypress/integration';
const REPORT_PATH          = __dirname + '/../../report-feature';
const SUMMARY_PATH         = __dirname + '/../../report-feature/summaries.txt';
const SUMMARY_PROCESS_PATH = __dirname + '/../../report-feature/summaries-process.txt';



const Report = require('./cucumber-summary-report-features');


let report = new Report();




try {
    createFolders(REPORT_PATH);
    clearFolder(REPORT_PATH);
    for (const filePath of report.walkSync(ROOT_PATH)) {
        console.log(filePath)
        if (filePath.split('.').pop() !== 'feature') return false;
        let arScenario = report.extractScenario(filePath);
        let a          = `${filePath}|${path.basename(filePath, '.feature')}|${arScenario.length}`;

        //list of features
        fs.appendFileSync(`${REPORT_PATH}/featureList.txt`, `${filePath}\n`);

        //list of features with scenarioList
        fs.appendFileSync(`${REPORT_PATH}/featureScenario.txt`, `${filePath}\n`);
        fs.appendFileSync(`${REPORT_PATH}/featureScenario.txt`, `${arScenario.join('\n') || ''}\n\n\n`);

        //list of scenarios
        fs.appendFileSync(`${REPORT_PATH}/scenarioList.txt`, `${arScenario.join('\n') || ''}\n`);

        //summary information [path | name | escenario]
        fs.appendFileSync(`${REPORT_PATH}/summaries.txt`, `${a}\n`);
    }
} catch (e) {
    console.error(e);
}


