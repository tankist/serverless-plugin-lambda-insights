'use strict';


const layerVersion = 14;


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

      let toggle = false;
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
          // attach layer to function
          fn.layers = [...fn.layers,
            `arn:aws:lambda:${this.provider.region}:580247275435:layer:LambdaInsightsExtension:${layerVersion}`];
          toggle = true;
        }
      });
      if (toggle) {
        // attach CloudWatchLambdaInsightsExecutionRolePolicy
        this.provider.iamManagedPolicies = [...this.provider.iamManagedPolicies,
          `arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy`];
      }
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
