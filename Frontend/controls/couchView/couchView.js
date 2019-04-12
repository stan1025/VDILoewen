  function CouchController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;
    ctrl.city = '';
    ctrl.offers = '';

    ctrl.loadCouch = function() {
      if (ctrl.userId) {
        $http.get(ctrl.server + "/user/couch", { params: {userID: ctrl.userId}})
        .then(function (response) {
            //console.log(response.data);
            ctrl.Data = response.data;
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 couch");

        })
      }
    }

    //send updated data to server
      ctrl.delete = function() {
        $http.post(ctrl.server + "/user/couch", {userID: ctrl.userId, couchData: ctrl.Data})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 couch");

      })
    }
    
      //send updated data to server
      ctrl.update = function(value) {
        $http.post(ctrl.server + "/user/couch", {userID: ctrl.userId, couchData: ctrl.Data})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 couch");

      })
    }

    //search for results on server
    ctrl.search = function() {
      //console.log(ctrl.userId);
      $http.get(ctrl.server + "/couch/" + ctrl.city + "/profiles")
      .then(function (response) {
          //console.log(response.data);
          ctrl.offers = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 1 couch");

      })
    }

    ctrl.orderByMe = function(x) {
      ctrl.myOrderBy = x;
    }

    //load profile if user changes (e.g. login)
    ctrl.$onChanges = function (changesObj) {
      if ('' != ctrl.userId)
      {
        ctrl.user = ctrl.userId;
        ctrl.loadCouch();
      }
      ctrl.city = '';
      ctrl.offers = '';
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