const fs    = require('fs');
const path  = require('path');

module.exports = class Report {
    * walkSync(dir) {
        const files = fs.readdirSync(dir, {withFileTypes: true});
        for (const file of files) {
            if (file.isDirectory()) {
                yield* this.walkSync(path.join(dir, file.name));
            } else {
                if (file.name.split('.').pop() !== 'feature') return false;
                yield path.join(dir, file.name);
            }
        }
    }
    extractScenario(file) {
        let lines = fs.readFileSync(file, 'utf-8');
        lines = lines.match(/.*(Scenario).*/g) || [];
        lines = lines.map(ln => ln.trim());
        return lines;
    }
    extractScenarioOutline(file) {
        const lines = fs.readFileSync(file, 'utf-8');
        return lines.match(/.*(Scenario outline).*/g) || [];
    }
    extractTagsAll(file) {
        const lines = fs.readFileSync(file, 'utf-8');
        return lines.match(/.*(Scenario outline).*/g) || [];
    }
};