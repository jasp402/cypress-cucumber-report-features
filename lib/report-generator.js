const path                         = require('path');
const fs                           = require('fs');
const {AsciiTable3, AlignmentEnum} = require('ascii-table3');
const utils                        = require('../utils');
const parser                       = require("gherkin-parse");
let Report                         = require('./core-report-feature');
let report                         = new Report();

//[1] - Generate list Features
const reportListFeatures = (pathE2E = 'integration') =>{
    try {
        for (const filePath of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            fs.appendFileSync(`${utils.REPORT_PATH}/featureList.txt`, `${filePath}\n`);
            console.log(filePath);
        }
        console.log('completed successful - featureList.txt ');
    }
    catch (e) {
        console.error(e);
    }
}

//[2] - Generate list of Scenarios by Features
const reportListScenariosByFeatures = (pathE2E = 'integration') =>{
    try {
        for (const filePath of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            //list of features with scenarioList
            let arScenario = report.extractScenario(filePath);
            fs.appendFileSync(`${utils.REPORT_PATH}/featureScenario.txt`, `${filePath}\n`);
            fs.appendFileSync(`${utils.REPORT_PATH}/featureScenario.txt`, `${arScenario.join('\n') || ''}\n\n\n`);
            console.log(filePath);
        }
        console.log('completed successful - featureList.txt ');
    }
    catch (e) {
        console.error(e);
    }
}

//[3] - Generate list of only Scenarios
const reportListScenarios = (pathE2E = 'integration') =>{
    try {
        for (const filePath of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            //list of features with scenarioList
            let arScenario = report.extractScenario(filePath);
            //list of scenarios
            fs.appendFileSync(`${utils.REPORT_PATH}/scenarioList.txt`, `${arScenario.join('\n') || ''}\n`);
            console.log(filePath);
        }
        console.log('completed successful - featureList.txt ');
    }
    catch (e) {
        console.error(e);
    }
}

//[4] - Generate Summary Table
const reportSummaryTable = (pathE2E = 'integration') => {
    try {
        let RowMatrix = [];
        for (const filePath of report.walkSync(utils.ROOT_PATH(pathE2E))) {
            let fileName = filePath.split('/').pop();
            const jsonObject = parser.convertFeatureFileToJSON(filePath);
            fs.writeFileSync(`${utils.REPORT_PATH}/d/${fileName}.json`, JSON.stringify(jsonObject));

            //Total Scenarios
            let scene = jsonObject.feature.children;

            //Total ScenariosOutline
            let sceneOutline = jsonObject.feature.children.filter(x=>x.type==='ScenarioOutline');

            //Total Examples
            let examples = sceneOutline.map(x => x.examples);

            let result = {
                path        : filePath.split('cypress')[1],
                name        : fileName,
                scene       : scene.length,
                sceneOutline: sceneOutline.length,
                examples    : examples.length
            }

            console.table(result);
            console.log(Object.values(result));
            RowMatrix.push(filePath.split('cypress')[1], fileName, scene.length, sceneOutline.length, examples.length);
        }
        let buildTable =
                new AsciiTable3('Report by "features" for a scenario')
                    .setHeading('Path File', 'File name', 'Total Scene', 'Total SceneOutline', 'Total Examples')
                    .setAlign(3, AlignmentEnum.CENTER)
                    .addRowMatrix(RowMatrix);
        console.log(buildTable.toString());
        fs.writeFileSync(`${utils.SUMMARY_PROCESS_PATH}`, utils.separator + '\n');
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, utils.headerTitle + '\n');
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, buildTable.toString());
    }
    catch (e){
        console.error(e);
    }
}


exports.report = {
    reportListFeatures,
    reportListScenariosByFeatures,
    reportListScenarios,
    reportSummaryTable
}

//OLD INFORMATION
/*
const createReportTable = () => {
    try {
        if (!fs.existsSync(utils.SUMMARY_PATH)) throw 'Require execute first command --base';
        let arInformation = {};
        let lines         = fs.readFileSync(utils.SUMMARY_PATH, 'utf-8').split('\n');

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
}
*/
