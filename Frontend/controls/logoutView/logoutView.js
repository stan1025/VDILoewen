function logoutViewController($scope, $http) {
    var ctrl = this;
    //bindings do not work for some reason
  
    $scope.title = 'LogOut';

  }
  
  angular.module('VDILionExample').component('logoutView', {
    templateUrl: './controls/logoutView/logoutView.html',
    controller: logoutViewController,
    bindings: {
      home: '&'
    }
  });