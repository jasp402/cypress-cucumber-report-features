#! /usr/bin/env node
const path                         = require('path');
const fs                           = require('fs');
const {clearFolder}                = require('js-packtools')();
const {AsciiTable3, AlignmentEnum} = require('ascii-table3');
const utils                        = require('./utils');

const ROOT_PATH                    = __dirname + '/../cypress/integration';
const REPORT_PATH                  = __dirname + '/../report-feature';
const SUMMARY_PATH                 = __dirname + '/../report-feature/summaries.txt';
const SUMMARY_PROCESS_PATH         = __dirname + '/../report-feature/summaries-process.txt';
const Report                       = require('./cucumber-summary-report-features');


let report = new Report();

try {

    if (!fs.existsSync(SUMMARY_PATH)) throw 'Require execute first command --base';
    let arInformation = {};
    let lines         = fs.readFileSync(SUMMARY_PATH, 'utf-8').split('\n');

    let RowMatrix = [];
    lines.forEach((line, i) => {
        if (!line) return;
        line = line.split('|');
        RowMatrix.push([line[0].split('cypress')[1], line[1], line[2]]);

        arInformation[i] = {
            path     : line[0].split('cypress')[1],
            name     : line[1],
            scenarios: line[2]
        }
    });

    // console.table(RowMatrix);
    let buildTable =
            new AsciiTable3('Report by "features" for a scenario')
                .setHeading('Path File', 'File name', 'Test-case')
                .setAlign(3, AlignmentEnum.CENTER)
                .addRowMatrix(RowMatrix);
    console.log(buildTable.toString());
    fs.writeFileSync(`${SUMMARY_PROCESS_PATH}`, utils.separator + '\n');
    fs.appendFileSync(`${SUMMARY_PROCESS_PATH}`, utils.headerTitle + '\n');
    fs.appendFileSync(`${SUMMARY_PROCESS_PATH}`, buildTable.toString());
} catch (e) {
    console.error(e);
}


