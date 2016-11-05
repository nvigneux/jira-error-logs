(function (angular) {
  'use strict';

  // Modules
  angular.module('jiraErrorLogs', []);

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

  function refreshContextViewController(){
    var vm = this;
    vm.refreshContextView = refreshContextView;
    console.log('toto refreshContextView');

    /**
     * Retrieve context, historized user actions and API calls, then format this data for use by JiraCapture.
     * @returns {String} formatted data for use by JiraCapture.
     */
    function refreshContextView(){
      console.log('toto refreshContextView');
      return 'tito';
    }
  }

})(angular);
