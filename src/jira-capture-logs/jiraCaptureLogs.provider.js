(function (angular) {
  'use strict';

  /**
   * @desc config api provider
   */

  angular
    .module('jiraCaptureLogs.provider')
    .provider('jiraCaptureLogsSettings', jiraCaptureLogsSettingsProvider);

  function jiraCaptureLogsSettingsProvider() {
    var appVersion = '';
    var jiraCaptureId = '';
    var urlAppVersion = '';
    var apiName = [];

    /**
     * @desc set url of the ws to get app version in the http call
     * @param {string} value
     */
    this.setUrlAppVersion = function (value) {
      urlAppVersion = value;
    };

    /**
     * @desc set url of the different api
     * @param {array} value
     */
    this.setApiName = function (value) {
      apiName = value;
    };

    /**
     * @desc set id to allow jira to get the div with the logs
     * @param {string} value
     */
    this.setId = function (value) {
      jiraCaptureId = value;
    };

    this.$get = ['$http', function ($http) {

      function onLoadAppVersion(response){
        if(response && response.data) {
          appVersion = response.data.build.version;
          return appVersion;
        }
      }

      return {
        appVersion: function () {
          if(urlAppVersion) {
            return $http.get(urlAppVersion).then(onLoadAppVersion);
          }
        },
        apiName: apiName,
        jiraCaptureId: jiraCaptureId
      };

    }];
  }
})(angular);
