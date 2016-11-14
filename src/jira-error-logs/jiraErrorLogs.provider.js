(function (angular) {
  'use strict';

  angular
    .module('jiraErrorLogs.provider')
    .provider('jiraErrorLogsSettings', jiraErrorLogsSettingsProvider);

  function jiraErrorLogsSettingsProvider() {
    var appVersion = "";
    var urlAppVersion = "";
    var apiName = [];

    this.setUrlAppVersion = function (value) {
      urlAppVersion = value;
    };

    this.setApiName = function (value) {
      apiName = value;
    };

    this.$get = ['$http', function ($http) {

      function onLoadAppVersion(response){
        if(response && response.data) {
          appVersion = response.data.build.version;
          return appVersion;
        }
      }

      return {
        apiName: apiName,
        appVersion: function () {
          if(urlAppVersion) {
            return $http.get(urlAppVersion).then(onLoadAppVersion);
          }
        }
      };
    }];
  }
})(angular);
