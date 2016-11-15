(function (angular) {
  'use strict';
  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp;
  angular.module('jiraErrorLogs.provider', []);
  angular.module('jiraErrorLogs.http', []);
  angular.module('jiraErrorLogs.config', []);
  angular.module('jiraErrorLogs.service', []);
  angular.module('jiraErrorLogs.directive', []);

  // Modules
  angular.module('jiraErrorLogs', [
    'jiraErrorLogs.provider',
    'jiraErrorLogs.http',
    'jiraErrorLogs.service',
    'jiraErrorLogs.config',
    'jiraErrorLogs.directive'
  ]);

})(angular);

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

(function (angular) {
  'use strict';

  /**
   * @desc user context directive used to show log info
   * @example <div user-context></div>
   */
  angular
    .module('jiraErrorLogs.directive')
    .directive('userContext', userContext);

  function userContext(){
    var directive = {
      restrict: 'EA',
      template: '<pre style="display: none;" id="contexteDifyz">{{vm.refreshContextView()}}</pre>',
      scope: {
        userInfo : '='
      },
      controller: refreshContextViewController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  refreshContextViewController.$inject = ['logData', 'jiraErrorLogsSettings'];

  function refreshContextViewController(logData, jiraErrorLogsSettings){
    var vm = this;
    var appVersion;
    vm.refreshContextView = refreshContextView;

    jiraErrorLogsSettings.appVersion().then(
        function (response) {
          appVersion = response;
        }
    );
    /**
     * Retrivaluee context, historized user actions and API calls, then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){

      var histoUserData = logData.getUserHistoryLog();
      var histoTechData = logData.getTechHistoryLog();
      var rapport = 'Version API SP: ' + (appVersion ? appVersion : '') + '\n\n';

      if (vm.userInfo && vm.userInfo.isLogged) {
        rapport += 'Utilisateur actuellement identifié :\n\n';
        rapport += '* login: ' + vm.userInfo.login + '\n';
      } else {
        rapport += 'Utilisateur actuellement non identifié.\n'
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

(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */
  angular
    .module('jiraErrorLogs.service')
    .factory('logData', logData);

  function logData(){

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
     * Register a user action.
     * @param data user action.
     */
    function addUserHistoryLog(data){
      historizedUserData.push({date: new Date(), msg: data});
      if (historizedUserData.length > 5) {
        historizedUserData.shift();
      }
    }

    /**
     * get user action.
     */
    function getUserHistoryLog(){
      return historizedUserData;
    }

    /////////////////////////

    /**
     * Register a technical action (API call and responses).
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
     * get tech action.
     */
    function getTechHistoryLog(){
      return historizedTechData;
    }

    /////////////////////////

  }

})(angular);

(function (angular) {
  'use strict';

  angular
    .module('jiraErrorLogs.http')
    .factory('jiraLogHttpInterceptor', jiraLogHttpInterceptor);

  jiraLogHttpInterceptor.$inject = ['$q', 'logData', '$injector'];

  function jiraLogHttpInterceptor($q, logData, $injector) {

    var service = {

      'request': function(config) {
        $injector.invoke(function(jiraErrorLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraErrorLogsSettings.apiName.length; i++) {
            if (config && config.url && config.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && config.url.indexOf('/info') <= 0) {
              result.push(config.url);
            }
          }

          if(result.length){
            logData.addTechHistoryLog('appel API : ' + config.method + ' ' + config.url);
          }
        });
        return config;
      },

      'requestError': function(rejection) {
        $injector.invoke(function(jiraErrorLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraErrorLogsSettings.apiName.length; i++) {
            if (rejection && rejection.url && rejection.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && rejection.url.indexOf('/info') <= 0) {
              result.push(rejection.url);
            }
          }

          if(result.length){
            var msg = '{color:red}appel API : ' + rejection.method + ' ' + rejection.url;
            if (rejection.data && rejection.data.message) {
              msg += ', message "' + rejection.data.message + '"';
            }
            msg += '{color}';
            logData.addTechHistoryLog(msg);
          }
        });

        return $q.reject(rejection);
      },

      'response': function(response) {
        // Add API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

        $injector.invoke(function(jiraErrorLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraErrorLogsSettings.apiName.length; i++) {
            if (response.config && response.config.url && response.config.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && response.config.url.indexOf('/info') <= 0) {
              result.push(response.config.url);
            }
          }

          if(result.length){
            logData.addTechHistoryLog('réponse API : ' + response.config.method + ' ' + response.config.url + ', code ' + response.status);
          }
        });

        return response;
      },

      'responseError': function(rejection) {
        // Add failed API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

        $injector.invoke(function(jiraErrorLogsSettings) {
          var result = [];
          for (var i = 0; i < jiraErrorLogsSettings.apiName.length; i++) {
            if (rejection.config && rejection.config.url && rejection.config.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && rejection.config.url.indexOf('/info') <= 0) {
              result.push(rejection.config.url);
            }
          }

          if(result.length){
            var msg = '{color:red}réponse API : ' + rejection.config.method + ' ' + rejection.config.url + ', code ' + rejection.status;
            if (rejection.data && rejection.data.message) {
              msg += ', message "' + rejection.data.message + '"';
            }
            msg += '{color}';
            logData.addTechHistoryLog(msg);
          }
        });

        return $q.reject(rejection);
      }
    };

    return service;
  }

})(angular);
