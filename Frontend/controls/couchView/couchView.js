  function CouchController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;

    ctrl.loadCouch = function() {
      console.log(ctrl.userId);
      $http.get(ctrl.server + "/user/couch", { params: {userID: ctrl.userId}})
      .then(function (response) {
          //console.log(response.data);
          ctrl.Data = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 1a");

      })
    }

    //pass to upper module which skill has to be deleted
      ctrl.delete = function() {
        console.log('test1');
        //ctrl.onDelete({skill: ctrl.skill});
      };
    
      //pass to list controller which skill has to be updated to which value
      ctrl.update = function(value) {
        console.log('test2');
       // ctrl.onUpdate({skill: ctrl.skill, prop: prop, value: value});
      };

    //load profile if user changes (e.g. login)
    ctrl.$onChanges = function (changesObj) {
      if ('' != ctrl.userId)
      {
        ctrl.user = ctrl.userId;
        ctrl.loadCouch();
      }
    }
  }

    angular.module('VDILionExample').component('couchView', {
    templateUrl: './controls/couchView/couchView.html',
    controller: CouchController,
    bindings: {
      userId: '<', //logged in user
      editable: '<', //should the edit button been shown?
    }
  });