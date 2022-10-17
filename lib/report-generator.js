const path                                     = require('path');
const fs                                       = require('fs');
const {AsciiTable3, AlignmentEnum}             = require('ascii-table3');
const utils                                    = require('../utils');
const parser                                   = require("gherkin-parse");
let Report                                     = require('./core-report-feature');
const {deleteFile, createFolders, clearFolder} = require('js-packtools')();
let report                                     = new Report();

//[1] - Generate list Features
const reportListFeatures = (pathE2E = 'integration') => {
    try {
        let pathReport = `${utils.REPORT_PATH}/featureList.txt`;
        deleteFile(pathReport);
        for (const [filePath, fileName] of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            let sortPathfile = filePath.split(`${pathE2E}\\`)[1];
            fs.appendFileSync(pathReport, `${sortPathfile}\n`);
            console.log(sortPathfile);
        }
        console.info('\x1b[1;31m', '--- Completed Successful - featureList.txt ---', '\x1b[0m');
        return true;
    } catch (e) {
        console.error(e);
    }
}

//[2] - Generate list of Scenarios by Features
const reportListScenariosByFeatures = (pathE2E = 'integration') => {
    try {
        let pathReport = `${utils.REPORT_PATH}/featureScenarios.txt`;
        deleteFile(pathReport);

        for (const [filePath, fileName] of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            let arScenario   = report.extractScenario(filePath);
            let sortPathfile = filePath.split(`${pathE2E}\\`)[1];

            fs.appendFileSync(pathReport, `${sortPathfile}\n`);
            fs.appendFileSync(pathReport, `\t${arScenario.join('\n\t') || ''}\n\n\n`);
            console.log(sortPathfile);
            console.log(arScenario);
        }
        console.info('\x1b[1;31m', '--- Completed Successful - featureScenarios.txt ---', '\x1b[0m');

    } catch (e) {
        console.error(e);
    }
}

//[3] - Generate list of only Scenarios
const reportListScenarios = (pathE2E = 'integration') => {
    try {
        let pathReport = `${utils.REPORT_PATH}/scenarioList.txt`;
        deleteFile(pathReport);

        for (const [filePath, fileName] of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            let arScenario = report.extractScenario(filePath);
            fs.appendFileSync(pathReport, `${arScenario.join('\n') || ''}\n`);
            console.log(arScenario.join('\n').trim());
        }
        console.info('\x1b[1;31m', '--- Completed Successful - scenarioList.txt ---', '\x1b[0m');
    } catch (e) {
        console.error(e);
    }
}

//[4] - Generate Summary Table
const reportSummaryTable = (pathE2E = 'integration') => {
    try {
        let RowMatrix = [];
        createFolders(`${utils.REPORT_PATH}/json`);
        clearFolder(`${utils.REPORT_PATH}/json`);

        for (const [filePath, fileName] of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            let sortPathfile = filePath.split(`${pathE2E}\\`)[1];
            let pathName     = sortPathfile.replace('.feature', '').replace(/\\|\s+/g, '_');

            console.log(pathName);
            const jsonObject = parser.convertFeatureFileToJSON(filePath);
            fs.writeFileSync(`${utils.REPORT_PATH}/json/${pathName}.json`, JSON.stringify(jsonObject));

            //Total Scenarios
            let scene = jsonObject.feature.children.filter(x=>x.type==='Scenario');

            //Total ScenariosOutline
            let sceneOutline = jsonObject.feature.children.filter(x => x.type === 'ScenarioOutline');

            //Total Examples
            let examples = sceneOutline.map(x => x.examples);

            //Escenarios with Tags
            let sceneTags = scene.filter(x =>x.tags.length> 0);


            //Total item for Examples
            let itemExamples = sceneOutline.map(outline => {
                return outline.examples.map(examples => {
                    return examples.tableBody.length
                });
            });
            console.log('itemExamples', itemExamples);
            let result = {
                path          : sortPathfile,
                name          : fileName,
                scene         : scene.length,
                sceneTags     : sceneTags.length,
                sceneOutline  : sceneOutline.length,
                examples      : examples.length,
                itemByExamples: eval(itemExamples.join('+'))||0,
            }

            console.table(result);
            RowMatrix.push(Object.values(result));
        }
        let buildTable =
                new AsciiTable3('A report of "TEST" scenarios by feature')
                    .setHeading('Path','Name','Scenes','Scenes tags', 'Scenes Outline','Examples','Example items')
                    .setAlign(3, AlignmentEnum.CENTER)
                    .addRowMatrix(RowMatrix);
        console.log(buildTable.toString());
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, utils.headerTitle + '\n');
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, buildTable.toString());
    } catch (e) {
        console.error(e);
    }
}

exports.report = {
    reportListFeatures,
    reportListScenariosByFeatures,
    reportListScenarios,
    reportSummaryTable
}