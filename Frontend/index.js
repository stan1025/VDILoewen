var app = angular.module('VDILionExample', []);
const server = "http://localhost:3000";
//make global because bindings cause trouble; check
//var userID = "";

app.controller('ProfileController', function ($scope, $http) {
    ctrl = this;
    $scope.title = 'Benutzerprofil';
    $scope.screen = 'Login';
    $scope.userID ='';

    $scope.login = function(user) {
        $scope.userID = user;
        $scope.screen = 'Userprofile';
    }

    $scope.logout = function () {
        $scope.userID = '';
        $scope.screen ='Logout';
    }

    $scope.home = function () {
        $scope.userID = '';
        $scope.screen ='Login';
    }
});