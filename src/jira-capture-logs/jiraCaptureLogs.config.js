(function (angular) {
  'use strict';

  /**
   * @desc Config Jira logs Http provider
   */
  angular
    .module('jiraCaptureLogs.config')
    .config(jiraCaptureLogsConfig);

  /**
   * @desc Init http interceptor
   * @param $httpProvider
   */
  function jiraCaptureLogsConfig($httpProvider) {
    $httpProvider.interceptors.push('jiraCaptureLogsHttpInterceptor');
  }

})(angular);
