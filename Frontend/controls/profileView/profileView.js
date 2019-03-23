function ProfileViewController($http) {
  var ctrl = this;
  //server as global variable in first step
  ctrl.server = server;

  //get userlist to show the profile selection dropdown menu
  $http.get(ctrl.server + "/users")
    .then(function (response) {
        //console.log(response.data);
        ctrl.profiles = response.data;
    }, function () {
        // Second function handles error
        console.log("Something went wrong 1");

    })

  //load the profile data shown in the profile view section of the page
  ctrl.loadProfile = function () { 
    //get the data structure
  $http.get(ctrl.server + "/user/profile", { params: {userID: ctrl.user}})
    .then(function (response) {
        //console.log(response.data);
        ctrl.UserData = response.data;
    }, function () {
        // Second function handles error
        console.log("Something went wrong 1a");

    }),
    //get the avatar
  $http.get(ctrl.server + "/user/avatar", { params: {userID: ctrl.user}})
    .then(function (response) {
       // console.log(response.data);
        ctrl.UserAvatar = response.data;
      }, function () {
        // Second function handles error
        console.log("Something went wrong 1b");
      })
      //only show edit buttons if the user is viewing his own profile
      ctrl.editable = (ctrl.user == ctrl.userId);
    }
  
  //add an empty skill
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

    //function to handle update of user properties
    ctrl.updateProp = function(value) {
      ctrl.save();
    }
      
    //save function
  ctrl.save = function() {
        ctrl.UpdateUser();
      }

//updates user profile on the server
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
    userId: '<', //logged in user
    logout: '&' //inding of logout method, signature logout()
  }
});