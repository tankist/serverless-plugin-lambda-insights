# serverless-plugin-lambda-insights
A Serverless Framework Plugin allowing to enable Lambda Insights

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
<!-- [![npm version](https://badge.fury.io/js/serverless-plugin-tracing.svg)](https://badge.fury.io/js/serverless-plugin-tracing) -->
<!-- [![CircleCI](https://circleci.com/gh/alex-murashkin/serverless-plugin-tracing.svg?style=shield)](https://circleci.com/gh/alex-murashkin/serverless-plugin-tracing) -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/AlexanderMS/serverless-plugin-tracing/badge.svg)](https://coveralls.io/github/alex-murashkin/serverless-plugin-tracing) -->

Enables AWS Lambda Insights (https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/) for the entire Serverless stack or individual functions.

## Why using Lambda Insights  

> *CloudWatch Lambda Insights* is a monitoring and troubleshooting solution for serverless applications running on AWS Lambda. The solution collects, aggregates, and summarizes system-level metrics including CPU time, memory, disk, and network. It also collects, aggregates, and summarizes diagnostic information such as cold starts and Lambda worker shutdowns to help you isolate issues with your Lambda functions and resolve them quickly.

![AWS Documentation Example](https://docs.aws.amazon.com/lambda/latest/dg/images/lambdainsights-multifunction-view.png)

--------------- 
## Getting started
### Installation
`npm install --save-dev serverless-plugin-lambda-insights`

add Plugin to your `serverless.yml` in the plugins section.


### Usage 
Example `serverless.yml`:

```yaml
service: your-great-sls-service

provider:
  name: aws
  stage: dev

plugins:
  - serverless-plugin-lambda-insights

functions:
  mainFunction: #inherits tracing settings from "provider"
    lambdaInsights: true #turns on Lambda Insights for this function
    handler: src/app/index.handler
  secondFunction: #inherits tracing settings from "provider"
    lambdaInsights: false #turns off Lambda Insights for this function, will overrule custom settings
    handler: src/app/index.handler
 
custom:
  lambdaInsights: 
    defaultLambdaInsights: true #turn on Lambda Insights for all your function, if 
    attachPolicy: false #explicitly disable auto attachment Managed Policy. 
    lambdaInsightsVersion: 14 #specify the Layer Version
```
### Functionality

The plugin will enable Lambda Insights by adding a Lambda Layer ([see Layer Details and Versions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html)) and adding necessary permissions using the `arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy` as a AWS IAM Managed Policy. 

 You can check in your AWS Console:
go to AWS Lambda -> select your Lambda function -> Configuration tab -> Monitoring tools ->
"CloudWatch Lambda Insights". 
If `lambdaInsights` validated to `true` for a function,
the checkbox will be checked.


### Example
You can find an example in the example folder of this repository. Run it with the following comment.

`cd example; serverless deploy`

This will deploy a hallo-world Lambda function with Lambda Insights enables. 

--------------
## Want to contribute?
This is your repo - just go head and create a pull request ;)

Some open Ideas and Tasks:
  - [ ] Testing with Jest
  - [x] Add Toggle for auto policy attachment
  - [x] Add an example 
## Contact
This is a project created and maintained by a private person. 
In case you have any suggestions, questions or remarks, please raise an issue or reach out to @cstanger.
## License
This is a private project by private person, published under the [MIT](LICENSE) licence. 