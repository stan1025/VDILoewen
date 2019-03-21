function logoutViewController($scope, $http) {
    var ctrl = this;
    //bindings do not work for some reason
  
    $scope.title = 'LogOut';

  }
  
  angular.module('VDILionExample').component('logoutView', {
    template: ' <div class="w3-display-topright"> \
                    <button class="vdi-button vdi-white-background w3-round" ng-click="$ctrl.home()">Home</button> \
                </div> \
                <div class="w3-content vdi-white-background"> \
                   <h2>Auf Wiedersehen!</h2> \
                   <img src="./loewe.png" /> \
                </div> ',
    controller: logoutViewController,
    bindings: {
      home: '&'
    }
  });