function loginViewController($scope, $http) {
    var ctrl = this;
    //bindings do not work for some reason
    ctrl.server = server;
    ctrl.error = false;
    ctrl.user = '';
  
    $scope.title = 'LogIn';

    $http.get(ctrl.server + "/users")
      .then(function (response) {
          //console.log(response.data);
          ctrl.profiles = response.data;
      }, function () {
          // Second function handles error
          console.log("Something went wrong 1");
  
      })

    ctrl.login = function () {
        if (ctrl.user != '')
        {
            ctrl.error = false;
            ctrl.loginUser({user: ctrl.user});
        }
        else
        {
            ctrl.error = true;
        }
    }
  }
  
  // angular.module('VDILionExample').component('loginView', {
  //   template: ' <div class="w3-content vdi-white-background"> \
  //                   User <select class="vdi-select vdi-blue-background w3-round" ng-model="$ctrl.user" ng-options="x for x in $ctrl.profiles"></select><button ng-click="$ctrl.login()" class="vdi-button vdi-blue-background">Login</button>\
  //                   <div ng-show="$ctrl.error" style="background: red; color: white; opacity: 0.7;">Fehlerhafte Logindaten</div> \
  //                   <img src="./loewe.png"  /> \
  //               </div> ',
  //   controller: loginViewController,
  //   bindings: {
  //    // server: '@',
  //     loginUser: '&'
  //   }


    angular.module('VDILionExample').component('loginView', {
      templateUrl: './controls/loginView/loginView.html',
      controller: loginViewController,
      bindings: {
       // server: '@',
        loginUser: '&'
      }

  });