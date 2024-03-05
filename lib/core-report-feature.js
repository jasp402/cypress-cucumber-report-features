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
                yield [path.join(dir, file.name), file.name];
            }
        }
    }
    extractElementsFromFile(file) {
        // Leer el contenido del archivo una sola vez
        const fileContent = fs.readFileSync(file, 'utf-8');

        // Inicializar arreglos para almacenar los elementos extraídos
        let scenarios = [];
        let scenarioOutlines = [];
        let tags = [];

        // Dividir el contenido del archivo en líneas
        const lines = fileContent.split(/\r?\n/);

        // Analizar cada línea y clasificarla
        lines.forEach(line => {
            if (/.*(Scenario|Escenario):.*/.test(line)) {
                scenarios.push(line.trim());
            } else if (/.*(Scenario Outline|Esquema del Escenario):.*/.test(line)) {
                scenarioOutlines.push(line.trim());
            } else {
                const matchTags = line.match(/(@\w+)/g);
                if (matchTags) {
                    tags = tags.concat(matchTags);
                }
            }
        });

        // Devolver un objeto con los resultados
        return {
            scenarios,
            scenarioOutlines,
            tags
        };
    }
    extractScenario(file) {
        let lines = fs.readFileSync(file, 'utf-8');
        lines = lines.match(/.*(Scenario|Escenario).*/g) || [];
        lines = lines.map(ln => ln.trim());
        return lines;
    }
    extractScenarioOutline(file) {
        const lines = fs.readFileSync(file, 'utf-8');
        return lines.match(/.*(Scenario outline|Esquema del escenario).*/g) || [];
    }
    extractTagsAll(file) {
        const lines = fs.readFileSync(file, 'utf-8');
        return lines.match(/.*(Scenario outline|Esquema del escenario).*/g) || [];
    }
};