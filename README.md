# MongoDB Aggregation Pipeline Debugger

![MongoDB Logo](https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg)

The MongoDB Aggregation Pipeline Debugger is a powerful tool designed to help you analyze and debug your aggregation pipelines. Aggregation pipelines in MongoDB can sometimes become complex, making it challenging to identify issues or bottlenecks. This debugger aims to simplify the debugging process by providing insights into the data flow and transformations within your aggregation pipeline.

## Features

- **Step-by-Step Execution:** Visualize the execution of your aggregation pipeline step by step, allowing you to see the intermediate results at each stage.
- **Data Preview:** View the data at different stages of the pipeline to understand how it changes after each transformation.
- **Expression Evaluation:** Evaluate and preview the results of complex expressions used in `$project`, `$addFields`, and other stages.
- **Bottleneck Identification:** Identify stages that might be causing performance bottlenecks in your pipeline.
- **Error Highlighting:** Quickly identify errors or issues within your aggregation pipeline that might be causing unexpected results.
- **Sample Data Support:** Load and use sample data to simulate real-world scenarios and fine-tune your pipeline.
- **Export Results:** Export intermediate or final results for further analysis or sharing with your team.

## Installation

You can install the MongoDB Aggregation Pipeline Debugger using npm:

```sh
npm install pipeline-debugger
