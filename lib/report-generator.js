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
        console.log(utils.ROOT_PATH(pathTests));
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


        //Process --- HTML
        let htmlTable = '<table  id="example" class="stripe hover" style="width:100%; padding-top: 1em;  padding-bottom: 1em;"><thead><tr>';

// Add table headers
        ['Path','Name','Scenes','Scenes tags', 'Scenes Outline','Examples','Example items', 'Tags Examples'].forEach(header => {
            htmlTable += `<th>${header}</th>`;
        });

        htmlTable += '</tr></thead><tbody>';

// Add table rows
        RowMatrix.forEach(row => {
            htmlTable += '<tr>';
            row.forEach(cell => {
                htmlTable += `<td>${cell}</td>`;
            });
            htmlTable += '</tr>';
        });

        htmlTable += '</tbody></table>';

        const htmlFile = `
        <!DOCTYPE html>
                  <html lang="en" class="antialiased">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Cypress Cucumber Report Feature </title>
                        <meta name="description" content="">
                        <meta name="keywords" content="">
                        <link href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                        <link href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" rel="stylesheet">
                        <link href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css" rel="stylesheet">
                        <link href="https://cdn.datatables.net/buttons/1.7.1/css/buttons.dataTables.min.css" rel="stylesheet">
                            <style>
                                .dataTables_wrapper select,
                                .dataTables_wrapper .dataTables_filter input {
                                color: #4a5568;
                                padding-left: 1rem;
                                padding-right: 1rem;
                                padding-top: .5rem;
                                padding-bottom: .5rem;
                                line-height: 1.25;
                                border-width: 2px;
                                border-radius: .25rem;
                                border-color: #edf2f7;
                                background-color: #edf2f7;
                            }
                                table.dataTable.hover tbody tr:hover,
                                table.dataTable.display tbody tr:hover {
                                background-color: #ebf4ff;
                            }
                                .dataTables_wrapper .dataTables_paginate .paginate_button {
                                font-weight: 700;
                                border-radius: .25rem;
                                border: 1px solid transparent;
                            }
                                .dataTables_wrapper .dataTables_paginate .paginate_button.current {
                                color: #fff !important;
                                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06);
                                font-weight: 700;
                                border-radius: .25rem;
                                background: #667eea !important;
                                border: 1px solid transparent;
                            }
                                .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
                                color: #fff !important;
                                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06);
                                font-weight: 700;
                                border-radius: .25rem;
                                background: #667eea !important;
                                border: 1px solid transparent;
                            }
                                table.dataTable.no-footer {
                                border-bottom: 1px solid #e2e8f0;
                                margin-top: 0.75em;
                                margin-bottom: 0.75em;
                            }
                                table.dataTable.dtr-inline.collapsed>tbody>tr>td:first-child:before,
                                table.dataTable.dtr-inline.collapsed>tbody>tr>th:first-child:before {
                                background-color: #667eea !important;
                            }
                            </style>
                        </head>
                        <body class="bg-gray-100 text-gray-900 tracking-wider leading-normal">
                        <div class="container w-full md:w-4/5 xl:w-4/5  mx-auto px-2">
                            <h1 class="flex items-center font-sans font-bold break-normal text-indigo-500 px-2 py-8 text-xl md:text-2xl">
                                Summary <a class="underline mx-2" href="#">FEATURES</a> Reportes
                            </h1>
                            <div id='recipients' class="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
                            ${htmlTable}
                            </div>
                        </div>
                        <script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
                        <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
                        <script src="https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
                        <script src="https://cdn.datatables.net/buttons/1.7.1/js/dataTables.buttons.min.js"></script>
                        <script src="https://cdn.datatables.net/buttons/1.7.1/js/buttons.html5.min.js"></script>
                        <script>
                            $(document).ready(function() {
                            var table = $('#example').DataTable({
                            responsive: true,
                            dom: 'Bfrtip', 
                            buttons: [
                                'copy', 'csv', 'excel', 'pdf' 
                            ],
                            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                            pageLength: 25,
                        })
                            .columns.adjust()
                            .responsive.recalc();
                        });
                        </script>
                        </body>
                    </html>`;

        fs.writeFileSync(`${utils.SUMMARY_PROCESS_PATH_HTML}`, htmlFile);

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