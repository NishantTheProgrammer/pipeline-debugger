
const consoleOutput = (results, config) => {
    console.clear();
    results.forEach(({ stateNumber, stage, output }, index) => {
        console.log(`\x1b[42m\x1b[97mStage: ${stateNumber}\x1b[0m`);
        if (config.showQuery) {
            console.log(`\x1b[34m${JSON.stringify(stage, 3, 3)}\x1b[0m`);
        }
        console.log(`\x1b[32mOutput:\x1b[0m`);
        console.log(output);
    })
}


const debugPipeline = async (model, pipeline = [], config = {}) => {

    const defaultConfig = {
        outputMode: 'console',
        debuggerCollectionPrefix: 'pipeline-debugger',
        skipStages: [],
        limit: 2,
        showQuery: true
    };

    // Merge the provided config with the default config
    config = { ...defaultConfig, ...config };

    // Validate input parameters
    if (!model || !model.db) {
        throw new Error("Invalid model or database connection.");
    }

    if (!Array.isArray(pipeline)) {
        throw new Error("Pipeline should be an array.");
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
        if (i !== 0 && i === pipeline.length - 1) { await debuggerNewCollection.drop(); }
    }

    if (config.outputMode === 'console') {
        consoleOutput(results, config);
    }
};



module.exports = { debugPipeline };