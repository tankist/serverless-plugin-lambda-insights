'use strict';

// Lambda Insight Layer Version
// see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
const layerVersion = 14;

/**
 * Serverless Lambda Insights Plugin - serverless-plugin-lambda-insights
 * @class AddLambdaInsights
 */
class AddLambdaInsights {
  /**
   * AddLambdaInsights constructor
   * This class gets instantiated with a serverless object and a bunch of options.
   * @param  {object} serverless The serverless instance which enables access to global service config during
   */
  constructor(serverless) {
    this.serverless = serverless;
    this.service = this.serverless.service;
    this.provider = this.serverless.getProvider('aws');

    this.hooks = {
      'before:package:setupProviderConfiguration': this.addLambdaInsights.bind(this),
    };

    serverless.configSchemaHandler.defineFunctionProperties('aws', {
      properties: {
        lambdaInsights: {type: 'boolean'},
      },
    });

    serverless.configSchemaHandler.defineCustomProperties({
      properties: {
        lambdaInsights: {type: 'boolean'},
      },
    });
  }

  /**
   * Check if Lambda Insights parameter is type of Boolean
   * @param  {any} value Value to check
   * @return {boolean} return input value if boolean
   */
  checkLambdaInsightsType(value) {
    if (typeof value === 'boolean') {
      return value;
    } else {
      throw new Error(`lambdaInsights value must be set to either true or false`);
    }
  };

  /**
   * Attach Lambda Layer conditionally to each function
   * @param  {boolean} globalLambdaInsights global settings
   */
  addLambdaInsightsToFunctions(globalLambdaInsights) {
    if (typeof this.service.functions !== 'object') {
      return;
    }

    let policyToggle = false;
    Object.keys(this.service.functions).forEach((functionName) => {
      const fn = this.service.functions[functionName];
      const localLambdaInsights =
        this.service.functions[functionName].lambdaInsights || null;
      if (localLambdaInsights === null && globalLambdaInsights === null) {
        return;
      }

      const fnLambdaInsights =
        localLambdaInsights === null ?
          globalLambdaInsights :
          this.checkLambdaInsightsType(localLambdaInsights);

      if (fnLambdaInsights) {
        // attach Lambda Layer
        fn.layers = fn.layers || [];
        fn.layers.push(
            `arn:aws:lambda:${this.provider.getRegion()}:580247275435:layer:LambdaInsightsExtension:${layerVersion}`,
        );
        policyToggle = true;
      }
    });
    if (policyToggle) {
      // attach CloudWatchLambdaInsightsExecutionRolePolicy
      this.service.provider.iamManagedPolicies =
        this.service.provider.iamManagedPolicies || [];
      this.service.provider.iamManagedPolicies.push(
          `arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy`,
      );
    }
  };

  /**
   * Hook function to get global config value and executes addLambdaInsightsToFunctions
   */
  addLambdaInsights() {
    const globalLambdaInsights =
      this.service.custom && this.service.custom.lambdaInsights ?
        this.checkLambdaInsightsType(this.service.custom.lambdaInsights) :
        null;
    this.addLambdaInsightsToFunctions(globalLambdaInsights);
  };
}

module.exports = AddLambdaInsights;
