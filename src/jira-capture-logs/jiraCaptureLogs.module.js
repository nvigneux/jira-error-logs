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
