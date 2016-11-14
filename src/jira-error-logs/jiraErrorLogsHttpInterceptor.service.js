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
            if (response && response.url && response.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && response.url.indexOf('/info') <= 0) {
              result.push(response.url);
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
            if (rejection && rejection.url && rejection.url.indexOf(jiraErrorLogsSettings.apiName[i]) === 0 && rejection.url.indexOf('/info') <= 0) {
              result.push(rejection.url);
            }
          }

          if(result.length){
            var msg = '{color:red}réponse API : ' + rejection.rejection.method + ' ' + rejection.rejection.url + ', code ' + rejection.status;
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
