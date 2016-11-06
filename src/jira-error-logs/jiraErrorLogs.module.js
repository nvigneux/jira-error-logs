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
