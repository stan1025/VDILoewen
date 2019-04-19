  function practiceController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;
    ctrl.requestTypes = {Offer : "Angebot", Search : "Gesuch"};
    ctrl.practiceTypes = {FulltimeJob : "Vollzeitstelle ", Freelancer : "Teilzeitstelle", StudentJob : "Studentenjob", Internship : "Internship", FinalExam : "Abschlussarbeit" , Others : "andere"};
    ctrl.requestType = '';
    ctrl.practiceType = '';
    ctrl.onlyMine = false;
    ctrl.practices = [];

    ctrl.loadPractices = function() {
      if (ctrl.userId) {
        $http.get(ctrl.server + "/practices")
        .then(function (response) {
            //ctrl.practices = [];
            //console.log(response.data);
            /*angular.forEach(response.data, function(value, key) {
              this.push({data: value, uuid: key});
            }, ctrl.practices);*/
            ctrl.practices = response.data;
            //console.log(ctrl.practices);
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 practice");

        })
      }
    }

    ctrl.loadPracticeType = function() {
      if (ctrl.userId) {
        //console.log(ctrl.practiceType);
        $http.get(ctrl.server + "/practices/practiceType", {params: {practiceType: ctrl.practiceType}})
        .then(function (response) {
            //console.log(response.data);
            ctrl.practices = response.data;
            //console.log(ctrl.practices);
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 practice");

        })
      }
    }

    ctrl.loadRequestType = function() {
      if (ctrl.userId) {
        //console.log(ctrl.requestType);
        $http.get(ctrl.server + "/practices/requestType", {params: {requestType: ctrl.requestType}})
        .then(function (response) {
            //console.log(response.data);
            ctrl.practices = response.data;
            //console.log(ctrl.practices);
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 practice");

        })
      }
    }

    ctrl.change = function(value) {
      console.log(value);
      $http.post(ctrl.server + "/practices/update", {practiceID: value.ident, practiceData: value.data})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 practice");

      })
    }

    ctrl.loadMine = function() {
      //console.log(ctrl.onlyMine);
      if (ctrl.userId) {
        if (ctrl.onlyMine) {
          //console.log(ctrl.userId);
          $http.get(ctrl.server + "/practices/requestType/user", {params: {userID: ctrl.userId, requestType: ctrl.requestType}})
          .then(function (response) {
              //console.log(response.data);
              ctrl.practices = response.data;
              //console.log(ctrl.practices);
          }, function () {
              // Second function handles error
              console.log("Something went wrong 1 practice");

          })
        }
        else
          ctrl.loadRequestType();
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