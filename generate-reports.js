const path                         = require('path');
const fs                           = require('fs');
const {clearFolder}                = require('js-packtools')();
const {AsciiTable3, AlignmentEnum} = require('ascii-table3');

const Report = require('./cucumber-summary-report-features');


const base  = process.env.npm_config_base;
const table = process.env.npm_config_table;

const ROOT_PATH            = __dirname + '/../cypress/integration';
const REPORT_PATH          = __dirname + '/../report-feature';
const SUMMARY_PATH         = __dirname + '/../report-feature/summaries.txt';
const SUMMARY_PROCESS_PATH = __dirname + '/../report-feature/summaries-process.txt';


let headerTitle ='$$$$$$$\\                                            $$\\                     $$$$$$$$\\                       $$\\                                   \n' +
    '$$  __$$\\                                           $$ |                    $$  _____|                      $$ |                                  \n' +
    '$$ |  $$ | $$$$$$\\   $$$$$$\\   $$$$$$\\   $$$$$$\\  $$$$$$\\    $$$$$$\\        $$ |       $$$$$$\\   $$$$$$\\  $$$$$$\\   $$\\   $$\\  $$$$$$\\   $$$$$$\\  \n' +
    '$$$$$$$  |$$  __$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ \\_$$  _|  $$  __$$\\       $$$$$\\    $$  __$$\\  \\____$$\\ \\_$$  _|  $$ |  $$ |$$  __$$\\ $$  __$$\\ \n' +
    '$$  __$$< $$$$$$$$ |$$ /  $$ |$$ /  $$ |$$ |  \\__|  $$ |    $$$$$$$$ |      $$  __|   $$$$$$$$ | $$$$$$$ |  $$ |    $$ |  $$ |$$ |  \\__|$$$$$$$$ |\n' +
    '$$ |  $$ |$$   ____|$$ |  $$ |$$ |  $$ |$$ |        $$ |$$\\ $$   ____|      $$ |      $$   ____|$$  __$$ |  $$ |$$\\ $$ |  $$ |$$ |      $$   ____|\n' +
    '$$ |  $$ |\\$$$$$$$\\ $$$$$$$  |\\$$$$$$  |$$ |        \\$$$$  |\\$$$$$$$\\       $$ |      \\$$$$$$$\\ \\$$$$$$$ |  \\$$$$  |\\$$$$$$  |$$ |      \\$$$$$$$\\ \n' +
    '\\__|  \\__| \\_______|$$  ____/  \\______/ \\__|         \\____/  \\_______|      \\__|       \\_______| \\_______|   \\____/  \\______/ \\__|       \\_______|\n' +
    '                    $$ |                                                                                                                          \n' +
    '                    $$ |                                                                                                                          \n' +
    '                    \\__|                                                                                                                     v1.0.0'
let separator   = '+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+';


let report = new Report();

try {
    if (base) {
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
    } else if (table) {
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
        fs.writeFileSync(`${SUMMARY_PROCESS_PATH}`, separator+'\n');
        fs.appendFileSync(`${SUMMARY_PROCESS_PATH}`, headerTitle+'\n');
        fs.appendFileSync(`${SUMMARY_PROCESS_PATH}`, buildTable.toString());
    } else {
        throw '` --- Require add command: --base or --process for generate report`';
    }
} catch (e) {
    console.error(e);
}


