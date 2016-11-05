(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('jiraErrorLogs.config', [])
      .value('jiraErrorLogs.config', {
          debug: true
      });

  // Modules
  angular.module('jiraErrorLogs.directives', []);
  angular.module('jiraErrorLogs.services', []);
  angular.module('jiraErrorLogs',
      [
          'jiraErrorLogs.config',
          'jiraErrorLogs.directives',
          'jiraErrorLogs.services'
      ]);

})(angular);
