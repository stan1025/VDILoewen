  function practiceController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;
    ctrl.requestType = '';
    ctrl.practiceType = '';
    ctrl.onlyMine = false;
    ctrl.practices = [];

    ctrl.loadPractices = function() {
      if (ctrl.userId) {
        $http.get(ctrl.server + "/practices")
        .then(function (response) {
            ctrl.practices = [];
            //console.log(response.data);
            angular.forEach(response.data, function(value, key) {
              this.push({data: value, uuid: key});
            }, ctrl.practices);
            //ctrl.Data = response.data;
            //console.log(ctrl.practices);
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 practice");

        })
      }
    }


    ctrl.reset = function() {
      ctrl.requestType = '';
      ctrl.practiceType = '';
      ctrl.onlyMine = false;
      ctrl.loadPractices();
    }

    ctrl.orderByMe = function(x) {
      ctrl.myOrderBy = x;
    }

    //load profile if user changes (e.g. login)
    ctrl.$onChanges = function (changesObj) {
      if ('' != ctrl.userId)
      {
        ctrl.user = ctrl.userId;
        ctrl.reset();
      }
      ctrl.requestType = '';
      ctrl.practiceType = '';
      ctrl.onlyMine = false;
      ctrl.practices = [];
    }
  }

    angular.module('VDILionExample').component('practiceView', {
    templateUrl: './controls/practiceView/practiceView.html',
    controller: practiceController,
    bindings: {
      userId: '<', //logged in user
    }
  });