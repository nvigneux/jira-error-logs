(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */

  angular
    .module('jiraCaptureLogs.service')
    .factory('jiraCaptureLogs', jiraCaptureLogs);

  function jiraCaptureLogs(){

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
      historizedUserData.push({date: new Date(), msg: data});
      if (historizedUserData.length > 5) {
        historizedUserData.shift();
      }
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
      var dateNow = new Date();
      var now = dateNow.toLocaleString() + '.' + dateNow.getMilliseconds();
      historizedTechData.push({date: now, msg: data});
      if (historizedTechData.length > 10) {
        historizedTechData.shift();
      }
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
