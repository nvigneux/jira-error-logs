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
