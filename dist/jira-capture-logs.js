(function (angular) {
  'use strict';

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp;
  angular.module('jiraCaptureLogs.provider', []);
  angular.module('jiraCaptureLogs.http', []);
  angular.module('jiraCaptureLogs.config', []);
  angular.module('jiraCaptureLogs.service', []);
  angular.module('jiraCaptureLogs.directive', []);

  // Modules
  angular.module('jiraCaptureLogs', [
    'jiraCaptureLogs.provider',
    'jiraCaptureLogs.http',
    'jiraCaptureLogs.service',
    'jiraCaptureLogs.config',
    'jiraCaptureLogs.directive'
  ]);

})(angular);

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

(function (angular) {
  'use strict';

  /**
   * @desc user context directive used to show log info
   * @example <div jira-capture-logs user-info="user"></div>
   */
  angular
    .module('jiraCaptureLogs.directive')
    .directive('jiraCaptureLogs', jiraCaptureLogs);

  function jiraCaptureLogs(){
    var directive = {
      restrict: 'EA',
      template: '<pre style="display: none;" id="{{vm.jiraCaptureId}}">' +
      '{{vm.refreshContextView()}}' +
      '</pre>',
      scope: {
        userInfo : '='
      },
      controller: refreshContextViewController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  refreshContextViewController.$inject = ['jiraCaptureLogs', 'jiraCaptureLogsSettings'];

  function refreshContextViewController(jiraCaptureLogs, jiraCaptureLogsSettings){
    var vm = this;
    var appVersion;

    vm.refreshContextView = refreshContextView;
    vm.jiraCaptureId = jiraCaptureLogsSettings.jiraCaptureId;

    /**
     * @desc set app version
     */
    jiraCaptureLogsSettings.appVersion()
      .then(function (response) {
        appVersion = response;
      });

    /**
     * @desc Retrieve value context, historized user actions and API calls,
     * then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){

      var histoUserData = jiraCaptureLogs.getUserHistoryLog();
      var histoTechData = jiraCaptureLogs.getTechHistoryLog();
      var rapport = 'Version API SP: ' + (appVersion ? appVersion : '') + '\n\n';

      if (vm.userInfo && vm.userInfo.isLogged) {
        rapport += 'Utilisateur actuellement identifié :\n\n';
        rapport += '* login: ' + vm.userInfo.login + '\n';
      } else {
        rapport += 'Utilisateur actuellement non identifié.\n';
      }

      if (histoUserData && histoUserData.length > 0) {
        rapport += '\nDerniers événements fonctionnels:\n\n';
        histoUserData.forEach(function(value) {
          rapport += '* ' + value.date + ' - ' + value.msg + '\n';
        });
      }

      if (histoTechData && histoTechData.length > 0) {
        rapport += '\nDerniers événements techniques:\n\n';
        histoTechData.forEach(function(value) {
          rapport += '* ' + value.date + ' - ' + value.msg + '\n';
        });
      }

      return rapport;
    }
  }

})(angular);

(function (angular) {
  'use strict';

  angular
    .module('jiraCaptureLogs.http')
    .factory('jiraCaptureLogsHttpInterceptor', jiraCaptureLogsHttpInterceptor);

  jiraCaptureLogsHttpInterceptor.$inject = ['$q', 'jiraCaptureLogs', '$injector'];

  function jiraCaptureLogsHttpInterceptor($q, jiraCaptureLogs, $injector) {

    var service = {

      'request': function(config) {
        $injector.invoke(function(jiraCaptureLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraCaptureLogsSettings.apiName.length; i++) {

            if (config && config.url &&
                config.url.indexOf(jiraCaptureLogsSettings.apiName[i]) === 0 &&
                config.url.indexOf('/info') <= 0) {

              result.push(config.url);
            }
          }

          if(result.length){
            var msg = 'appel API : ' + config.method + ' ' + config.url;
            jiraCaptureLogs.addTechHistoryLog(msg);
          }
        });
        return config;
      },

      'requestError': function(rejection) {
        $injector.invoke(function(jiraCaptureLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraCaptureLogsSettings.apiName.length; i++) {

            if (rejection && rejection.url &&
                rejection.url.indexOf(jiraCaptureLogsSettings.apiName[i]) === 0 &&
                rejection.url.indexOf('/info') <= 0) {

              result.push(rejection.url);
            }
          }

          if(result.length){
            var msg = '{color:red}appel API : ' + rejection.method + ' ' + rejection.url;
            if (rejection.data && rejection.data.message) {
              msg += ', message "' + rejection.data.message + '"';
            }
            msg += '{color}';
            jiraCaptureLogs.addTechHistoryLog(msg);
          }
        });

        return $q.reject(rejection);
      },

      'response': function(response) {
        // Add API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

        $injector.invoke(function(jiraCaptureLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraCaptureLogsSettings.apiName.length; i++) {

            if (response.config && response.config.url &&
                response.config.url.indexOf(jiraCaptureLogsSettings.apiName[i]) === 0 &&
                response.config.url.indexOf('/info') <= 0) {

              result.push(response.config.url);
            }

          }

          if(result.length){
            var msg = 'réponse API : ' + response.config.method +
                      ' ' + response.config.url +
                      ', code ' + response.status;

            jiraCaptureLogs.addTechHistoryLog(msg);
          }
        });

        return response;
      },

      'responseError': function(rejection) {
        // Add failed API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

        $injector.invoke(function(jiraCaptureLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraCaptureLogsSettings.apiName.length; i++) {

            if (rejection.config && rejection.config.url &&
              rejection.config.url.indexOf(jiraCaptureLogsSettings.apiName[i]) === 0 &&
              rejection.config.url.indexOf('/info') <= 0) {

              result.push(rejection.config.url);
            }

          }

          if(result.length){
            var msg = '{color:red}réponse API : ' + rejection.config.method +
                      ' ' + rejection.config.url +
                      ', code ' + rejection.status;

            if (rejection.data && rejection.data.message) {
              msg += ', message "' + rejection.data.message + '"';
            }
            msg += '{color}';
            jiraCaptureLogs.addTechHistoryLog(msg);
          }
        });

        return $q.reject(rejection);
      }
    };

    return service;
  }

})(angular);

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

(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */

  angular
    .module('jiraCaptureLogs.service')
    .factory('jiraCaptureLogs', jiraCaptureLogs);

  function jiraCaptureLogs(){

    var historizedUserData = [], // user actions
        historizedTechData = []; // technical actions (API calls and responses)

    var service = {
      addUserHistoryLog: addUserHistoryLog,
      getUserHistoryLog: getUserHistoryLog,
      addTechHistoryLog: addTechHistoryLog,
      getTechHistoryLog: getTechHistoryLog
    };

    return service;

    /////////////////////////

    /**
     * @desc Register a user action.
     * @param data user action.
     */
    function addUserHistoryLog(data){
      historizedUserData.push({date: new Date(), msg: data});
      if (historizedUserData.length > 5) {
        historizedUserData.shift();
      }
    }

    /**
     * @desc get user action.
     */
    function getUserHistoryLog(){
      return historizedUserData;
    }

    /////////////////////////

    /**
     * @desc Register a technical action (API call and responses).
     * @param data technical action.
     */
    function addTechHistoryLog(data){
      var dateNow = new Date();
      var now = dateNow.toLocaleString() + '.' + dateNow.getMilliseconds();
      historizedTechData.push({date: now, msg: data});
      if (historizedTechData.length > 10) {
        historizedTechData.shift();
      }
    }

    /**
     * @desc get tech action.
     */
    function getTechHistoryLog(){
      return historizedTechData;
    }

    /////////////////////////

  }

})(angular);
