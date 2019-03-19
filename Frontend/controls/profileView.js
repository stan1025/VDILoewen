function ProfileViewController($http) {
  var ctrl = this;

  //workaorund because bindings are not working
  ctrl.server = server;
  ctrl.user = 'GUID1';//userID;


  ctrl.editable = (ctrl.user == userID);

  $http.get(ctrl.server + "/user/profile", { params: {userID: ctrl.user}})
    .then(function (response) {
        //console.log(response.data);
        ctrl.UserData = response.data;
    }, function () {
        // Second function handles error
        console.log("Something went wrong 1");

    }),
  $http.get(ctrl.server + "/user/avatar", { params: {userID: ctrl.user}})
    .then(function (response) {
       // console.log(response.data);
        ctrl.UserAvatar = response.data;
      }, function () {
        // Second function handles error
        console.log("Something went wrong 1a");
      })
  
  
    ctrl.addSkill = function () {
        ctrl.UserData.competencies.push({name: ' ', experienceLevel: '1'});
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
}

angular.module('VDILionExample').component('profileView', {
  templateUrl: 'controls/profileView.html',
  controller: ProfileViewController,
 /* bindings: {
    server: '@',
    user: '<'
  }*/
});