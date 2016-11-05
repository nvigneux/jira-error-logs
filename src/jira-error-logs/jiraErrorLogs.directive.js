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
