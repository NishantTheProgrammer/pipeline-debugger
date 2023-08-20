# MongoDB Aggregation Pipeline Debugger

![MongoDB Logo](https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg)

The MongoDB Aggregation Pipeline Debugger is a powerful tool designed to help you analyze and debug your aggregation pipelines. Aggregation pipelines in MongoDB can sometimes become complex, making it challenging to identify issues or bottlenecks. This debugger aims to simplify the debugging process by providing insights into the data flow and transformations within your aggregation pipeline.

## Features

- **Step-by-Step Execution:** Visualize the execution of your aggregation pipeline step by step, allowing you to see the intermediate results at each stage.

- **Data Preview:** Gain insights into data transformations at various pipeline stages to track how it evolves after each step. Select from three engaging preview modes:
  - **Console Mode:** Observe data directly in the console, offering quick visual feedback.
  - **File Log Mode:** Access data through a dedicated log file, delivering a comprehensive view of the pipeline's impact.
  - **File JSON Mode:** Access data as structured JSON files, enabling you to easily analyze and share results.


- **Expression Evaluation:** Evaluate and preview the results of complex expressions used in `$project`, `$addFields`, and other stages.
- **Bottleneck Identification:** Identify stages that might be causing performance bottlenecks in your pipeline.
- **Export Results:** Export intermediate or final results for further analysis or sharing with your team.
- **Interactive Interface:** Interact with the pipeline execution, pause, and inspect data at any stage to gain deeper insights.
- **Error Tracing:** Easily locate errors or unexpected behavior by observing the data transformation process in detail.
- **Visualization:** Visual representation of the data flow and transformations aids in understanding and debugging.
- **Customizable Views:** Tailor the display to focus on specific aspects of your data or pipeline.
- **Real-time Monitoring:** Monitor execution progress in real-time, perfect for large pipelines.



## Installation

You can install the package using npm:

```sh
npm install pipeline-debugger
```




## API Reference

### `debugPipeline(model, pipeline, config)`

Debugs a pipeline of stages in a model.

**Parameters:**

- `model` (Object): The model to debug.
- `pipeline` (Array): The pipeline stages to debug.
- `config` (DebugConfig): Configuration options for debugging.

**DebugConfig**:

- `outputMode` (string, optional): Output mode ('console', 'fileJson', or 'fileLog'). Default is 'console'.
- `debuggerCollectionPrefix` (string, optional): Prefix for debugger collection names. Default is 'pipeline-debugger'.
- `skipStages` (Array<number>, optional): Stages to skip during debugging. Default is an empty array.
- `limit` (number, optional): Maximum number of results to include in output. Default is 2.
- `shouldStringify` (boolean, optional): Whether to stringify output objects. Default is true.
- `showQuery` (boolean, optional): Whether to display the query stage in the output. Default is true.

## Example

```javascript
const { debugPipeline } = require('pipeline-debugger');

const model = /* ... */;
const pipeline = /* ... */;
const config = {
    outputMode: 'console',
    skipStages: [1, 3],
    limit: 5,
    shouldStringify: true,
    showQuery: true
};

debugPipeline(model, pipeline, config);
```

## Package Information

- **Package Name:** pipeline-debugger
- **Author Name:** NishantTheProgrammer
- **GitHub URL:** [https://github.com/NishantTheProgrammer/pipeline-debugger](https://github.com/NishantTheProgrammer/pipeline-debugger)
