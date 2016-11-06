(function (angular) {
  'use strict';

  /**
   * @desc Config Jira logs Http provider
   */
  angular
    .module('jiraErrorLogs.config')
    .config(jiraErrorLogsConfig);

  function jiraErrorLogsConfig($httpProvider) {
    $httpProvider.interceptors.push('jiraLogHttpInterceptor');
  }

})(angular);
