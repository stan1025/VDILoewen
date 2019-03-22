function ProfileViewController($http) {
  var ctrl = this;
  //server as global variable in first step
  ctrl.server = server;

  $http.get(ctrl.server + "/users")
    .then(function (response) {
        //console.log(response.data);
        ctrl.profiles = response.data;
    }, function () {
        // Second function handles error
        console.log("Something went wrong 1");

    })

  ctrl.loadProfile = function () { 
  $http.get(ctrl.server + "/user/profile", { params: {userID: ctrl.user}})
    .then(function (response) {
        //console.log(response.data);
        ctrl.UserData = response.data;
    }, function () {
        // Second function handles error
        console.log("Something went wrong 1a");

    }),
  $http.get(ctrl.server + "/user/avatar", { params: {userID: ctrl.user}})
    .then(function (response) {
       // console.log(response.data);
        ctrl.UserAvatar = response.data;
      }, function () {
        // Second function handles error
        console.log("Something went wrong 1b");
      })
      ctrl.editable = (ctrl.user == ctrl.userId);
    }
  
  
    ctrl.addSkill = function () {
      //create field competencies in user daa if it does not exit yes
      if (!ctrl.UserData.competencies)
        {
          ctrl.UserData.competencies = [{name: 'New Skill', experienceLevel: '1'}];
        }
        else
        {
          ctrl.UserData.competencies.push({name: 'New Skill', experienceLevel: '1'});
        }
    }

    ctrl.updateProp = function(value) {
      ctrl.save();
    }
      
  ctrl.save = function() {
        ctrl.UpdateUser();
      }


  ctrl.UpdateUser = function () {
      $http.post(ctrl.server + "/user/profile", {userID: ctrl.user, userProfile: ctrl.UserData}/*, {headers: { 'Content-Type': 'application/json' }}*/)
            .then(function (response) {
                //console.log(response.data);
            }, function () {
                // Second function handles error
                console.log("Something went wrong 2");

            });
            /*).catch(function(response) {
              console.log({ query: ({userID: ctrl.user, userProfile: ctrl.UserData})});
              console.error('error', response.status, response.data);
            })
            .finally(function() {
              console.log("finally finished");
            });*/
    }

    //load profile if user changes (e.g. login)
    ctrl.$onChanges = function (changesObj) {
      if ('' != ctrl.userId)
      {
        ctrl.user = ctrl.userId;
        ctrl.loadProfile();
      }
    }
}

angular.module('VDILionExample').component('profileView', {
  templateUrl: './controls/profileView/profileView.html',
  controller: ProfileViewController,
  bindings: {
 //   server: '@',
    userId: '<',
    logout: '&'
  }
});