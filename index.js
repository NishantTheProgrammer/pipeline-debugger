const fs = require('fs');
const path = require('path');

/**
 * Debugs a pipeline of stages in a model.
 *
 * @param {Object} model - The model to debug.
 * @param {Array} pipeline - The pipeline stages to debug.
 * @param {Object} config - Configuration options for debugging.
 * @property {string} [config.outputMode='console'] - Output mode ('console', 'fileJson', or 'fileLog').
 * @property {string} [config.debuggerCollectionPrefix='pipeline-debugger'] - Prefix for debugger collection names.
 * @property {Array<number>} [config.skipStages=[]] - Stages to skip during debugging.
 * @property {number} [config.limit=2] - Maximum number of results to include in output.
 * @property {boolean} [config.shouldStringify=true] - Whether to stringify output objects.
 * @property {boolean} [config.showQuery=true] - Whether to display the query stage in the output.
 */
const consoleOutput = (results, config) => {
    console.clear();
    results.forEach(({ stateNumber, stage, output }) => {
        console.log(`\x1b[42m\x1b[97mStage: ${stateNumber}\x1b[0m`);
        if (config.showQuery) {
            console.log(`\x1b[34m${JSON.stringify(stage, null, 3)}\x1b[0m`);
        }
        console.log(`\x1b[32mOutput:\x1b[0m`);
        console.log(config.shouldStringify ? JSON.stringify(output, null, 3) : output);
    });
};

/**
 * Writes debugging results to a file.
 *
 * @param {Array} results - An array of debugging results.
 * @param {Object} config - Configuration options for output.
 * @param {string} mode - Output mode ('json' or 'log').
 */
const fileOutput = async (results, config, mode) => {
    let fileContent = '';
    if (mode === 'json') {
        fileContent = JSON.stringify(results, null, 3);
    } else if (mode === 'log') {
        fileContent = results
            .map(
                ({ stateNumber, stage, output }) => `
Stage: ${stateNumber}
--------
${config.showQuery ? JSON.stringify(stage, null, 3) : ''}
Output:
-------
${config.shouldStringify ? JSON.stringify(output, null, 3) : output}
            `
            )
            .join('\n');
    }
    const appDir = path.dirname(require.main.filename);
    const writePath = path.join(appDir, config.debuggerCollectionPrefix + '.' + mode);

    await fs.promises.writeFile(writePath, fileContent); // Using promises to write files asynchronously
    console.log('Logs written to: ', writePath);
};

/**
 * Available configuration options for debugging.
 * @typedef {Object} DebugConfig
 * @property {('console' | 'fileJson' | 'fileLog')} [outputMode='console'] - Output mode ('console', 'fileJson', or 'fileLog').
 * @property {string} [debuggerCollectionPrefix='pipeline-debugger'] - Prefix for debugger collection names.
 * @property {Array<number>} [skipStages=[]] - Stages to skip during debugging.
 * @property {number} [limit=2] - Maximum number of results to include in output.
 * @property {boolean} [shouldStringify=true] - Whether to stringify output objects.
 * @property {boolean} [showQuery=true] - Whether to display the query stage in the output.
 */

/**
 * Debugs a pipeline of stages in a model.
 *
 * @param {Object} model - The model to debug.
 * @param {Array} pipeline - The pipeline stages to debug.
 * @param {DebugConfig} config - Configuration options for debugging.
 */
const debugPipeline = async (model, pipeline = [], config = {}) => {
    const defaultConfig = {
        outputMode: 'console',
        debuggerCollectionPrefix: 'pipeline-debugger',
        skipStages: [],
        limit: 2,
        shouldStringify: true,
        showQuery: true,
    };

    // Merge the provided config with the default config
    config = { ...defaultConfig, ...config };

    // Validate input parameters
    if (!model || !model.db) {
        throw new Error('Invalid model or database connection.');
    }

    if (!Array.isArray(pipeline)) {
        throw new Error('Pipeline should be an array.');
    }

    const db = model.db;
    const results = [];

    for (const [i, stage] of pipeline.entries()) {
        const debuggerOldCollectionName = `${config.debuggerCollectionPrefix}-${i}`;
        const debuggerNewCollectionName = `${config.debuggerCollectionPrefix}-${i + 1}`;
        const debuggerOldCollection = db.collection(debuggerOldCollectionName);
        const debuggerNewCollection = db.collection(debuggerNewCollectionName);
        const query = [stage, { $out: debuggerNewCollectionName }];

        if (i === 0) {
            await model.aggregate(query);
        } else {
            const cursor = await debuggerOldCollection.aggregate(query);
            await cursor.toArray();
            await debuggerOldCollection.drop();
        }

        if (!config.skipStages.includes(i + 1)) {
            const output = await debuggerNewCollection.find({}).limit(config.limit).toArray();
            results.push({ stateNumber: i + 1, stage, output });
        }
        if (i !== 0 && i === pipeline.length - 1) {
            await debuggerNewCollection.drop();
        }
    }

    if (config.outputMode === 'console') {
        consoleOutput(results, config);
    } else if (config.outputMode === 'fileJson') {
        fileOutput(results, config, 'json');
    } else if (config.outputMode === 'fileLog') {
        fileOutput(results, config, 'log');
    }
};


module.exports = { debugPipeline };
