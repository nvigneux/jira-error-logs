(function (angular) {
  'use strict';

  angular
    .module('jiraErrorLogs.http')
    .factory('jiraLogHttpInterceptor', jiraLogHttpInterceptor);

  jiraLogHttpInterceptor.$inject = ['$q'];

  function jiraLogHttpInterceptor($q) {

    var service = {

      'request': function(config) {
        console.log('config', config);

        //if (config && config.url &&
        //  (
        //    config.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    config.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && config.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  logData.addTechHistoryLog('appel API : ' + config.method + ' ' + config.url);
        //}

        return config;
      },
      'requestError': function(rejection) {
        console.log('rejection', rejection);

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
        //  logData.addTechHistoryLog(msg);
        //}

        return $q.reject(rejection);
      },

      'response': function(response) {
        console.log('response', response);
        // Add API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

        //
        //if (response.config && response.config.url &&
        //  (
        //    response.config.url.indexOf(ApiConfig.API_EDITOR) === 0 ||
        //    response.config.url.indexOf(ApiConfig.API_SP) === 0
        //  )
        //  && response.config.url.indexOf(ApiConfig.API_SP + '/info') !== 0
        //) {
        //  logData.addTechHistoryLog('réponse API : ' + response.config.method + ' ' + response.config.url + ', code ' + response.status);
        //}

        return response;
      },

      'responseError': function(rejection) {
        console.log('rejection', rejection);
        // Add failed API calls to historized user actions. Note that we filter calls to templates
        // and BO version API (filter by url), and calls to multipart data (filter by header).

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
        //  logData.addTechHistoryLog(msg);
        //}

        return $q.reject(rejection);
      }
    };

    return service;
  }

})(angular);
