(function (angular) {
  'use strict';

  /**
   * @desc config library provider
   */

  angular
    .module('jiraCaptureLogs.provider')
    .provider('jiraCaptureLogsSettings', jiraCaptureLogsSettingsProvider);

  function jiraCaptureLogsSettingsProvider() {
    var appVersion = '';
    var jiraCaptureId = '';
    var urlAppVersion = '',
        httpAppversion = false;
    var techLogsLength,
        userLogsLength;
    var apiName = [];

    /**
     * @desc set url of the ws to get app version in the http call
     * @param {string} value
     * @param {boolean} http
     */
    this.setUrlAppVersion = function (value, http) {
      urlAppVersion = value;
      httpAppversion = http;
    };

    /**
     * @desc set url of the different api
     * @param {array} value
     */
    this.setApiName = function (value) {
      apiName = value;
    };

    /**
     * @desc set id to allow Jira to get the div with the logs
     * @param {string} value
     */
    this.setId = function (value) {
      jiraCaptureId = value;
    };

    /**
     * @desc set the length of tech logs save by the directive
     * @param {int} value
     */
    this.setTechLogsLength = function (value) {
      techLogsLength = value;
    };

    /**
     * @desc set the length of data logs save by the directive
     * @param {int} value
     */
    this.setUserLogsLength = function (value) {
      userLogsLength = value;
    };

    this.$get = ['$http', '$q', function ($http, $q) {

      function onLoadAppVersion(response){
        if(response && response.data) {
          appVersion = response.data.build.version;
          return appVersion;
        }
      }

      function getAppVersion(http){
        if(http) {
          return $http.get(urlAppVersion).then(onLoadAppVersion);
        }else{
          var defer = $q.defer();
          defer.resolve(urlAppVersion);
          return defer.promise;
        }
      }

      return {
        appVersion: function () {
          if(urlAppVersion) {
            return getAppVersion(httpAppversion);
          }
        },
        urlAppVersion:urlAppVersion,
        apiName: apiName,
        jiraCaptureId: jiraCaptureId,
        techLogsLength: techLogsLength,
        userLogsLength: userLogsLength
      };

    }];
  }
})(angular);
