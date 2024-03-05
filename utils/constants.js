'use strict';
const path = require('path');
const cwd  = process.cwd();

module.exports = Object.freeze({
    ROOT_PATH                   : (pathTests) => path.join(cwd, 'cypress', pathTests),
    REPORT_PATH                 : path.join(cwd, 'report-feature'),
    FEATURES_FILE_PATH          : path.join(cwd, 'report-feature', 'featureList.txt'),
    FEATURES_SCENERIES_FILE_PATH: path.join(cwd, 'report-feature', 'featureSceneriesList.txt'),
    SCENERIES_FILE_PATH         : path.join(cwd, 'report-feature', 'SceneriesList.txt'),
    SUMMARY_PATH                : `${__dirname}/../../../report-feature/summaries.txt`,
    SUMMARY_PROCESS_PATH        : `${__dirname}/../../../report-feature/summaries-process.txt`,
});