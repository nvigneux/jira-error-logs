(function (angular) {
  'use strict';
  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('jiraErrorLogs.config', [])
      .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('jiraLogHttpInterceptor');
      }]);

  // Modules
  angular.module('jiraErrorLogs',
      [
          'jiraErrorLogs.config'
      ]);

})(angular);

(function (angular) {
  'use strict';

  /**
   * @desc user context directive used to show log info
   * @example <div user-context></div>
   */
  angular
    .module('jiraErrorLogs')
    .directive('userContext', userContext);

  function userContext(){
    var directive = {
      restrict: 'EA',
      template: '<pre style="display: none;" id="contexteDifyz">{{vm.refreshContextView()}}</pre>',
      scope: {},
      controller: refreshContextViewController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  refreshContextViewController.$inject = ['logData'];

  function refreshContextViewController(logData){
    var vm = this;
    vm.refreshContextView = refreshContextView;

    /**
     * Retrieve context, historized user actions and API calls, then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){

      //var u = User.getUser();
      var histoUserData = logData.getHistorizedUserData;
      var histoTechData = logData.getHistorizedTechData;
      //var rapport = 'Version API SP: ' + $scope.apiVersion + '\n\n';
      var rapport = 'Version API SP:\n\n';

      //if (u && u.login) {
      //  rapport += 'Utilisateur actuellement identifié :\n\n';
      //  rapport += '* login: ' + u.login + '\n';
      //} else {
      //  rapport += 'Utilisateur actuellement non identifié.\n'
      //}

      //if (histoUserData && histoUserData.length > 0) {
      if (histoUserData) {
        rapport += '\nDerniers événements fonctionnels:\n\n';
        histoUserData.forEach(function(ev) {
          rapport += '* ' + ev.date + ' - ' + ev.msg + '\n';
        });
      }

      //if (histoTechData && histoTechData.length > 0) {
      if (histoTechData) {
        rapport += '\nDerniers événements techniques:\n\n';
        histoTechData.forEach(function(ev) {
          rapport += '* ' + ev.date + ' - ' + ev.msg + '\n';
        });
      }
      return rapport;
    }
  }

})(angular);

(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */
  angular
    .module('jiraErrorLogs')
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
    .module('jiraErrorLogs')
    .factory('jiraLogHttpInterceptor', jiraLogHttpInterceptor);

  jiraLogHttpInterceptor.$inject = ['$q'];

  function jiraLogHttpInterceptor($q) {

    var service = {

      'request': function(config) {
        console.log('config', config);
        //var injector = angular.element('[ng-app]').injector();
        //var UserService = injector.get('User');
        //if (config && config.url &&
        //  (
        //    config.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    config.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && config.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  UserService.getUser().addTechHistory('appel API : ' + config.method + ' ' + config.url);
        //}

        return config;
      },
      'requestError': function(rejection) {
        console.log('rejection', rejection);
        //var injector = angular.element('[ng-app]').injector();
        //var UserService = injector.get('User');
        //
        //if (rejection && rejection.url &&
        //  (
        //    rejection.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    rejection.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && rejection.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  var msg = '{color:red}appel API : ' + rejection.method + ' ' + rejection.url;
        //  if (rejection.data && rejection.data.message) {
        //    msg += ', message "' + rejection.data.message + '"';
        //  }
        //  msg += '{color}';
        //  UserService.getUser().addTechHistory(msg);
        //}

        return $q.reject(rejection);
      },

      'response': function(response) {
        console.log('response', response);
        // Add API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).
        //var injector = angular.element('[ng-app]').injector();
        //var UserService = injector.get('User');
        //
        //if (response.config && response.config.url &&
        //  (
        //    response.config.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    response.config.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && response.config.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  UserService.getUser().addTechHistory('réponse API : ' + response.config.method + ' ' + response.config.url + ', code ' + response.status);
        //}

        return response;
      },

      'responseError': function(rejection) {
        console.log('rejection', rejection);
        // Add failed API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).
        //var injector = angular.element('[ng-app]').injector();
        //var UserService = injector.get('User');
        //
        //if (rejection.config && rejection.config.url &&
        //  (
        //    rejection.config.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    rejection.config.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && rejection.config.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  var msg = '{color:red}réponse API : ' + rejection.config.method + ' ' + rejection.config.url + ', code ' + rejection.status;
        //  if (rejection.data && rejection.data.message) {
        //    msg += ', message "' + rejection.data.message + '"';
        //  }
        //  msg += '{color}';
        //  UserService.getUser().addTechHistory(msg);
        //}

        return $q.reject(rejection);
      }
    };

    return service;
  }

})(angular);
