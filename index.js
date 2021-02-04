'use strict';

/**
 * module description
 * @module AddLambdaInsights
*/
class AddLambdaInsights {
  /**
     * constructor description
     * @param  {object} serverless [description]
     * @param  {[object]} options [description]
  */
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('aws');

    this.hooks = {
      'package:createDeploymentArtifacts': this.addLambdaInsights,
    };

    checkLambdaInsightsType=(value)=>{
      if (typeof value === 'boolean') {
        return value;
      } else {
        throw new Error(`lambdaInsights value must be set to either true or false`);
      }
    };

    addLambdaInsightsToFunctions = (globalLambdaInsights) => {
      const service = this.serverless.service;
      if (typeof service.functions !== 'object') {
        return;
      }

      const resources = service.resources || {};
      resources.Resources = service.Resources || {};

      Object.keys(service.functions).forEach((functionName) => {
        const fn = service.functions[functionName];
        const localLambdaInsights = service.functions[functionName].lambdaInsights || null;
        if (localLambdaInsights === null && globalLambdaInsights === null) {
          return;
        }

        const fnLambdaInsights =
          localLambdaInsights === null ?
            globalLambdaInsights :
              this.checkLambdaInsightsType(localLambdaInsights);

        if (fnLambdaInsights) {
          // attach LAyer to lambda
        }
        // const logGroupLogicalId = this.provider.naming.getLogGroupLogicalId(functionName);

        // const resource = {
        //   Type: 'AWS::Logs::LogGroup',
        //   Properties: {
        //     RetentionInDays: functionLogRetentionInDays,
        //   },
        // };
        // resources.Resources[logGroupLogicalId] = resource;
      });
    };

    addLambdaInsights = ()=>{
      const service = this.serverless.service;
      const globalLambdaInsights =
        service.custom && service.custom.lambdaInsights ?
        this.checkLambdaInsightsType(service.custom.lambdaInsights) :
        null;
      this.addLambdaInsightsToFunctions(globalLambdaInsights);
    };
  }
}


module.exports = AddLambdaInsights;
