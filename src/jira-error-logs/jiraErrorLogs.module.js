(function (angular) {
  'use strict';
  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config Jira logs Http provider
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
