(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */

  angular
    .module('jiraCaptureLogs.service')
    .factory('jiraCaptureLogs', jiraCaptureLogs);

  jiraCaptureLogs.$inject = ['$injector'];

  function jiraCaptureLogs($injector){

    var historizedUserData = [], // user actions
        historizedTechData = []; // technical actions (API calls and responses)

    var service = {
      addUserHistoryLog: addUserHistoryLog,
      getUserHistoryLog: getUserHistoryLog,
      addTechHistoryLog: addTechHistoryLog,
      getTechHistoryLog: getTechHistoryLog
    };

    return service;

    /////////////////////////

    /**
     * @desc Register a user action.
     * @param data user action.
     */
    function addUserHistoryLog(data){
      // $injector.invoke - fix for circular dependency error
      // $injector is used to retrieve object instances as defined by provider
      $injector.invoke(function(jiraCaptureLogsSettings) {

        var userLogsLength = jiraCaptureLogsSettings.userLogsLength ? jiraCaptureLogsSettings.userLogsLength : 5;

        historizedUserData.push({date: new Date(), msg: data});
        if (historizedUserData.length > userLogsLength) {
          historizedUserData.shift();
        }
      });
    }

    /**
     * @desc get user action.
     */
    function getUserHistoryLog(){
      return historizedUserData;
    }

    /////////////////////////

    /**
     * @desc Register a technical action (API call and responses).
     * @param data technical action.
     */
    function addTechHistoryLog(data){
      // $injector.invoke - fix for circular dependency error
      // $injector is used to retrieve object instances as defined by provider
      $injector.invoke(function(jiraCaptureLogsSettings) {

        var techLogsLength = jiraCaptureLogsSettings.techLogsLength ? jiraCaptureLogsSettings.techLogsLength : 10;
        var dateNow = new Date();
        var now = dateNow.toLocaleString() + '.' + dateNow.getMilliseconds();

        historizedTechData.push({date: now, msg: data});
        if (historizedTechData.length > techLogsLength) {
          historizedTechData.shift();
        }
      });
    }

    /**
     * @desc get tech action.
     */
    function getTechHistoryLog(){
      return historizedTechData;
    }

    /////////////////////////

  }

})(angular);
