const fs    = require('fs');
const path  = require('path');

module.exports = class Report {
    * walkSync(dir) {
        const files = fs.readdirSync(dir, {withFileTypes: true});
        for (const file of files) {
            if (file.isDirectory()) {
                yield* this.walkSync(path.join(dir, file.name));
            } else {
                yield path.join(dir, file.name);
            }
        }
    }

    extractScenario(file) {
        const lines = fs.readFileSync(file, 'utf-8');
        return lines.match(/.*(Scenario).*/g) || [];
    }
};