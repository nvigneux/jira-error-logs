(function (angular) {
  'use strict';

  angular
    .module('jiraErrorLogs.provider')
    .provider('jiraErrorLogsSettings', jiraErrorLogsSettingsProvider);

  function jiraErrorLogsSettingsProvider() {
    var appVersion = "";
    var apiName = [];

    this.setAppVersion = function (value) {
      appVersion = value;
    };

    this.setApiName = function (value) {
      apiName = value;
    };

    this.$get = function () {
      return {
        appVersion: appVersion,
        apiName: apiName
      };
    };
  }
})(angular);
