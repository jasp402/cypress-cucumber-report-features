
const fs                                       = require('fs');
const {AsciiTable3, AlignmentEnum}             = require('ascii-table3');
const utils                                    = require('../utils');
const parser                                   = require("gherkin-parse");
let Report                                     = require('./core-report-feature');
const {deleteFile, createFolders, clearFolder} = require('js-packtools')();
let report                                     = new Report();



//[1] - Generate list Features
const reportListFeatures = (pathTests) => {
    const featureFilePath = utils.FEATURES_FILE_PATH;
    const rootPath = utils.ROOT_PATH(pathTests);
    try {
        deleteFile(featureFilePath);
        for (const [filePath,] of report.walkSync(rootPath)) {
            let sortPathfile = filePath.split(`${pathTests}\\`)[1];
            fs.appendFileSync(featureFilePath, `${sortPathfile}\n`);
            //console.log(sortPathfile);
        }
        console.info('\x1b[1;31m', '--- Completed Successful - open featureList.txt ---', '\x1b[0m');
        return true;
    } catch (e) {
        console.error(e);
    }
}

//[2] - Generate list of Scenarios by Features
const reportListScenariosByFeatures = (pathTests) => {
    let pathReport = utils.FEATURES_SCENERIES_FILE_PATH;
    const rootPath = utils.ROOT_PATH(pathTests);
    try {
        deleteFile(pathReport);
        for (const [filePath, ] of report.walkSync(rootPath)) {
            let arScenario   = report.extractScenario(filePath);
            let sortPathfile = filePath.split(`${pathTests}\\`)[1];

            fs.appendFileSync(pathReport, `${sortPathfile}\n`);
            fs.appendFileSync(pathReport, `\t${arScenario.join('\n\t') || ''}\n\n\n`);
            console.log(sortPathfile);
            console.log(arScenario);
        }
        console.info('\x1b[1;31m', '--- Completed Successful - Open featureSceneries.txt ---', '\x1b[0m');

    } catch (e) {
        console.error(e);
    }
}

//[3] - Generate list of only Scenarios
const reportListScenarios = (pathTests) => {
    try {
        let pathReport = utils.SCENERIES_FILE_PATH;
        deleteFile(pathReport);

        for (const [filePath,] of report.walkSync(utils.ROOT_PATH(pathTests))) {
            let arScenario = report.extractScenario(filePath);
            fs.appendFileSync(pathReport, `${arScenario.join('\n') || ''}\n`);
            console.log(arScenario.join('\n').trim());
        }
        console.info('\x1b[1;31m', '--- Completed Successful - Open SceneriesList.txt ---', '\x1b[0m');
    } catch (e) {
        console.error(e);
    }
}

//[4] - Generate Summary Table
const reportSummaryTable = (pathTests) => {
    try {
        let RowMatrix = [];
        createFolders(`${utils.REPORT_PATH}/json`);
        clearFolder(`${utils.REPORT_PATH}/json`);

        for (const [filePath, fileName] of report.walkSync(utils.ROOT_PATH(pathTests))) {
            let tagsExamples = {};
            let sortPathfile = filePath.split(`${pathTests}\\`)[1];
            let pathName     = sortPathfile.replace('.feature', '').replace(/\\|\s+/g, '_');

            const jsonObject = parser.convertFeatureFileToJSON(filePath);

            if(!('feature' in jsonObject && jsonObject.feature !== undefined)) {
                console.error('\x1b[1;31m', `☢ There is no TEST in the file for this feature: ${fileName}`, '\x1b[0m');
            }else{
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
                let itemExamples = [];
                sceneOutline.forEach(outline => {
                    outline.examples.forEach(examples => {
                        itemExamples.push(examples.tableBody.length);
                    });
                });

                //Examples by Tags
                let contentTags = [];
                examples.forEach(example => {
                    example.forEach(content => {
                        if(content.tags.length>0){
                            content.tags.forEach(oTags => {
                                contentTags.push(content);
                                tagsExamples[oTags.name] = contentTags;
                            });
                            contentTags = [];
                        }
                    });
                });

                let result = {
                    path          : sortPathfile,
                    name          : fileName,
                    scene         : scene.length,
                    sceneTags     : sceneTags.length,
                    sceneOutline  : sceneOutline.length,
                    examples      : examples.length,
                    itemByExamples: eval(itemExamples.join('+'))||0,
                    tagsExamples  : Object.keys(tagsExamples).length||0,
                }
                RowMatrix.push(Object.values(result));
            }
        }
        let buildTable =
                new AsciiTable3('A report of "TEST" scenarios by feature')
                    .setHeading('Path','Name','Scenes','Scenes tags', 'Scenes Outline','Examples','Example items', 'Tags Examples')
                    .setAlign(3, AlignmentEnum.CENTER)
                    .addRowMatrix(RowMatrix);
        console.log(buildTable.toString());
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, utils.headerTitle + '\n');
        fs.appendFileSync(`${utils.SUMMARY_PROCESS_PATH}`, buildTable.toString());
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    reportListFeatures,
    reportListScenariosByFeatures,
    reportListScenarios,
    reportSummaryTable
}