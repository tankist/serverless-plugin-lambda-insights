"use strict";

//Lambda Insight Layer Version
//see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
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
    this.service = this.serverless.service;
    this.options = options;
    this.provider = this.serverless.getProvider("aws");

    this.hooks = {
      "package:createDeploymentArtifacts": this.addLambdaInsights,
    };
  }

  checkLambdaInsightsType = (value) => {
    if (typeof value === "boolean") {
      return value;
    } else {
      throw new Error(
        `lambdaInsights value must be set to either true or false`
      );
    }
  };

  addLambdaInsightsToFunctions = (globalLambdaInsights) => {
    if (typeof this.service.functions !== "object") {
      return;
    }

    const resources = this.service.resources || {};
    resources.Resources = this.service.Resources || {};

    let policyToggle = false;
    Object.keys(this.service.functions).forEach((functionName) => {
      const fn = this.service.functions[functionName];
      const localLambdaInsights =
        this.service.functions[functionName].lambdaInsights || null;
      if (localLambdaInsights === null && globalLambdaInsights === null) {
        return;
      }

      const fnLambdaInsights =
        localLambdaInsights === null
          ? globalLambdaInsights
          : this.checkLambdaInsightsType(localLambdaInsights);

      if (fnLambdaInsights) {
        // attach Lambda Layer
        fn.layers = fn.layers || [];
        fn.layers.push(
          `arn:aws:lambda:${this.provider.getRegion()}:580247275435:layer:LambdaInsightsExtension:${layerVersion}`
        );
        policyToggle = true;
      }
    });
    if (policyToggle) {
      // attach CloudWatchLambdaInsightsExecutionRolePolicy
      this.service.provider.iamManagedPolicies =
        this.service.provider.iamManagedPolicies || [];
      this.service.provider.iamManagedPolicies.push(
        `arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy`
      );
    }
  };

  addLambdaInsights = () => {
    const globalLambdaInsights =
      this.service.custom && this.service.custom.lambdaInsights
        ? this.checkLambdaInsightsType(this.service.custom.lambdaInsights)
        : null;
    this.addLambdaInsightsToFunctions(globalLambdaInsights);
  };
}

module.exports = AddLambdaInsights;
