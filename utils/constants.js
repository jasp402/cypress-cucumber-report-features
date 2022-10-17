'use strict';
module.exports = Object.freeze({
    ROOT_PATH           : (pathE2E) => `${__dirname}/../../../cypress/${pathE2E}`,
    REPORT_PATH         : `${__dirname}/../../../report-feature`,
    SUMMARY_PATH        : `${__dirname}/../../../report-feature/summaries.txt`,
    SUMMARY_PROCESS_PATH: `${__dirname}/../../../report-feature/summaries-process.txt`,
});