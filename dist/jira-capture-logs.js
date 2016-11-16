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
        userIsLogged : '=',
        userLogin : '='
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
    vm.jiraCaptureId = jiraCaptureLogsSettings.jiraCaptureId ? jiraCaptureLogsSettings.jiraCaptureId : jiraCaptureIdConfig();

    function jiraCaptureIdConfig(){
      console.error('Jira Capture Logs - ID is not defined');
      return 'jiraCaptureId';
    }

    //set app version
    if(jiraCaptureLogsSettings.urlAppVersion) {
      getAppVersion();
    }else{
      console.error('Jira Capture Logs - API Version is not defined');
    }

    function getAppVersion(){
      jiraCaptureLogsSettings.appVersion()
        .then(function (response) {
          appVersion = response;
        });
    }

    /**
     * @desc Retrieve value context, historized user actions and API calls,
     * then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){

      var histoUserData = jiraCaptureLogs.getUserHistoryLog();
      var histoTechData = jiraCaptureLogs.getTechHistoryLog();
      var rapport = (appVersion ? 'Version API SP: ' + appVersion : '') + '\n\n';

      if (vm.userIsLogged) {
        var login = vm.userLogin ? vm.userLogin : 'Login non renseigné';
        rapport += 'Utilisateur actuellement identifié :\n\n';
        rapport += '* login: ' + login + '\n';
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
        // $injector.invoke - fix for circular dependency error
        // $injector is used to retrieve object instances as defined by provider
        $injector.invoke(function(jiraCaptureLogsSettings) {
          if(jiraCaptureLogsSettings.apiName && jiraCaptureLogsSettings.apiName.length) {
            var result = [];
            for (var i = 0; i < jiraCaptureLogsSettings.apiName.length; i++) {

              if (config && config.url &&
                config.url.indexOf(jiraCaptureLogsSettings.apiName[i]) === 0 &&
                config.url.indexOf('/info') <= 0) {

                result.push(config.url);
              }
            }

            if (result.length) {
              var msg = 'appel API : ' + config.method + ' ' + config.url;
              jiraCaptureLogs.addTechHistoryLog(msg);
            }
          }else{
            console.error('Jira Capture Logs - API Name is not defined');
          }
        });
        return config;
      },

      'requestError': function(rejection) {
        // $injector.invoke - fix for circular dependency error
        // $injector is used to retrieve object instances as defined by provider
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

        // $injector.invoke - fix for circular dependency error
        // $injector is used to retrieve object instances as defined by provider
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

        // $injector.invoke - fix for circular dependency error
        // $injector is used to retrieve object instances as defined by provider
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

(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */

  angular
    .module('jiraCaptureLogs.service')
    .factory('jiraCaptureLogs', jiraCaptureLogs);

  jiraCaptureLogs.$inject = ['$injector'];

  function jiraCaptureLogs($injector){

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
      var userLogsLength = 5;
      // $injector.invoke - fix for circular dependency error
      // $injector is used to retrieve object instances as defined by provider
      $injector.invoke(function(jiraCaptureLogsSettings) {
        userLogsLength = jiraCaptureLogsSettings.userLogsLength ? jiraCaptureLogsSettings.userLogsLength : userLogsLength;
      });

      historizedUserData.push({date: new Date(), msg: data});
      if (historizedUserData.length > userLogsLength) {
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
      var techLogsLength = 10;
      // $injector.invoke - fix for circular dependency error
      // $injector is used to retrieve object instances as defined by provider
      $injector.invoke(function(jiraCaptureLogsSettings) {
        techLogsLength = jiraCaptureLogsSettings.techLogsLength ? jiraCaptureLogsSettings.techLogsLength : techLogsLength;
      });

      historizedTechData.push({date: now, msg: data});
      if (historizedTechData.length > techLogsLength) {
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
