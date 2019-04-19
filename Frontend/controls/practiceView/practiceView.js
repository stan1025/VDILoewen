  function practiceController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;
    ctrl.requestTypes = {Offer : "Angebot", Search : "Gesuch"};
    ctrl.practiceTypes = {FulltimeJob : "Vollzeitstelle ", Freelancer : "Teilzeitstelle", StudentJob : "Studentenjob", Internship : "Internship", FinalExam : "Abschlussarbeit" , Others : "andere"};
    ctrl.requestType = '';
    ctrl.practiceType = '';
    ctrl.showOverlay = false;
    ctrl.match = '';
    ctrl.practices = [];
    ctrl.myOffers = [];
    ctrl.mySearch = [];
    ctrl.defaultPractice = {"practiceType":"Others","requestType":"Offer","description":"Beschreibung","competencies":[]};

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

    ctrl.change = function(value, reload = false) {
      //console.log(value);
      $http.post(ctrl.server + "/practices/update", {practiceID: value.ident, practiceData: value.data})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
          if (reload) {
            ctrl.loadMySearch();
            ctrl.loadMyOffers();
          }
          if (ctrl.practices.find(x => x.ident === value.ident))
            ctrl.practices.find(x => x.ident === value.ident).data = value.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 practice");

      })
    }

    //creates new practice entry
    //params:
    //value: data of the entry
    //type: type of the entry
    ctrl.create = function(type) {
      var value = ctrl.defaultPractice;
      value.requestType = type;
      //console.log(value);

      $http.post(ctrl.server + "/practices/create", {userID: ctrl.userId, practiceData: value})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
          ctrl.loadMySearch();
          ctrl.loadMyOffers();
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 practice");

      })
    }

    //add an empty skill
    //params:
    //value: data of the entry
    ctrl.addSkill = function (value) {
      //create field competencies in user daa if it does not exit yes
      if (!value.competencies)
        {
          value.competencies = [{name: 'New Skill', experienceLevel: '1'}];
        }
        else
        {
          value.competencies.push({name: 'New Skill', experienceLevel: '1'});
        }
    }

    //delete practice entry
    //params:
    //value: data of the entry
    ctrl.delete = function (value) {
      //create field competencies in user daa if it does not exit yes
      $http.post(ctrl.server + "/practices/close", {practiceID: value.ident})
      .then(function (response) {
          //console.log(response.data);
          //ctrl.Data = response.data;
          ctrl.loadMySearch();
          ctrl.loadMyOffers();
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 practice");

      })
    }

    //get matching practice entries
    //params:
    //value: data of the entry
    ctrl.getMatch = function (value) {
      //create field competencies in user daa if it does not exit yes
      $http.get(ctrl.server + "/practices/results", {params :{practiceID: value.ident}})
      .then(function (response) {
          //console.log(response.data);
          value.matches = response.data;
          //console.log(value);
      }, function () {
          // Second function handles error
          console.log("Something went wrong 2 practice");

      })
    }

    //show match results in overlay
    ctrl.Overlay = function(element) {
      ctrl.match = element;
      ctrl.showOverlay = true;
    }

    ctrl.loadMyOffers = function() {
      //console.log(ctrl.onlyMine);
      if (ctrl.userId) {
        //console.log(ctrl.userId);
        $http.get(ctrl.server + "/practices/requestType/user", {params: {userID: ctrl.userId, requestType: "Offer"}})
        .then(function (response) {
            //console.log(response.data);
            ctrl.myOffers = response.data;
            ctrl.myOffers.forEach(element => {
              ctrl.getMatch(element);
            });
            //console.log(ctrl.practices);
        }, function () {
            // Second function handles error
            console.log("Something went wrong 1 practice");

        })
      }
    }

    ctrl.loadMySearch = function() {
      //console.log(ctrl.onlyMine);
      if (ctrl.userId) {
        //console.log(ctrl.userId);
        $http.get(ctrl.server + "/practices/requestType/user", {params: {userID: ctrl.userId, requestType: "Search"}})
        .then(function (response) {
            //console.log(response.data);
            ctrl.mySearch = response.data;
            ctrl.mySearch.forEach(element => {
              ctrl.getMatch(element);
            });
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
      ctrl.showOverlay = false;
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
        ctrl.loadMySearch();
        ctrl.loadMyOffers();
      }
      ctrl.requestType = '';
      ctrl.practiceType = '';
      ctrl.showOverlay = false;
      ctrl.practices = [];
      ctrl.myOffers = [];
      ctrl.mySearch = [];
    }
  }

    angular.module('VDILionExample').component('practiceView', {
    templateUrl: './controls/practiceView/practiceView.html',
    controller: practiceController,
    bindings: {
      userId: '<', //logged in user
    }
  });