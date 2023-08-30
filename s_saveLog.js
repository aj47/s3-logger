
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'arash',
  applicationName: 'appricot-clients',
  appUid: 'h4SrwGQ4xLlc9V9qxM',
  orgUid: 'fyqtt8sDgXmkGzZ6zV',
  deploymentUid: '061e79aa-9373-49e3-993f-8740c6504818',
  serviceName: 's3-logger',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 's3-logger-dev-saveLog', timeout: 6 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}