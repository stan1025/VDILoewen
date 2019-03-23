function logoutViewController($scope, $http) {
    var ctrl = this;
    //in this module only the home-method of the upper module is called. This method is passed by bindings
  
    $scope.title = 'LogOut';

  }
  
  angular.module('VDILionExample').component('logoutView', {
    templateUrl: './controls/logoutView/logoutView.html',
    controller: logoutViewController,
    bindings: {
      home: '&' //binding of home method, signature home()
    }
  });