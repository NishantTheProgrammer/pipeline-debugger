
const consoleOutput = (results, config) => {
    console.clear();
    results.forEach(({ stage, output }, index) => {
        console.log(`\x1b[42m\x1b[97mStage: ${index + 1}\x1b[0m`);
        if (config.showQuery) {
            console.log(`\x1b[34m${JSON.stringify(stage, 3, 3)}\x1b[0m`);
        }
        console.log(`\x1b[32mOutput:\x1b[0m`);
        console.log(output);
    })
}




/**
 * Debugs a MongoDB pipeline by executing each stage and capturing output for debugging purposes.
 * @param {object} model - The MongoDB model with a database connection.
 * @param {Array} pipeline - The array of pipeline stages to debug.
 * @param {object} config - Configuration options for debugging.
 */
 const debugPipeline = async (model, pipeline = [], config = {
    outputMode: 'console',
    debuggerCollectionPrefix: 'pipeline-debugger',
    skipStages: [],
    limit: 2,
    showQuery: true
}) => {
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
        
        const output = await debuggerNewCollection.find({}).limit(config.limit).toArray();
        if(i !== 0 && i === pipeline.length - 1) { await debuggerNewCollection.drop(); }
        results.push({ stage, output });
    }

    if(config.outputMode === 'console') {
        consoleOutput(results, config);
    }
};



module.exports = { debugPipeline };