(function (angular) {
  'use strict';

  /**
   * @desc services used to set/get log data in array
   */
  angular
    .module('jiraErrorLogs')
    .factory('logData', logData);

  function logData(){

    var historizedUserData = [];

    var service = {
      addHistoryLog: addHistoryLog,
      getHistoryLog: getHistoryLog
    };

    return service;

    /////////////////////////

    function addHistoryLog(data){
      historizedUserData.push({date: new Date(), msg: data});
      if (historizedUserData.length > 10) {
        historizedUserData.shift();
      }
    }

    function getHistoryLog(){
      return historizedUserData;
    }

  }

})(angular);
