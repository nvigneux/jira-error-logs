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
        userInfo : '='
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
    vm.jiraCaptureId = jiraCaptureLogsSettings.jiraCaptureId;

    /**
     * @desc set app version
     */
    jiraCaptureLogsSettings.appVersion()
      .then(function (response) {
        appVersion = response;
      });

    /**
     * @desc Retrieve value context, historized user actions and API calls,
     * then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){

      var histoUserData = jiraCaptureLogs.getUserHistoryLog();
      var histoTechData = jiraCaptureLogs.getTechHistoryLog();
      var rapport = 'Version API SP: ' + (appVersion ? appVersion : '') + '\n\n';

      if (vm.userInfo && vm.userInfo.isLogged) {
        rapport += 'Utilisateur actuellement identifié :\n\n';
        rapport += '* login: ' + vm.userInfo.login + '\n';
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