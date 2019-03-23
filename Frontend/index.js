var app = angular.module('VDILionExample', []);
const server = "http://localhost:3000";

app.controller('ProfileController', function ($scope, $http) {
    ctrl = this;
    //Initialwerte schreiben
    $scope.title = 'Benutzerprofil';
    $scope.screen = 'Login';
    $scope.userID ='';

    //Callback-Funktion für die LogIn Seite, setzt den aktiven Benutzer und schaltet die Seite um
    $scope.login = function(user) {
        $scope.userID = user;
        $scope.screen = 'Userprofile';
    }

    //Callback-Funktion für die Member Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.logout = function () {
        $scope.userID = '';
        $scope.screen ='Logout';
    }

    //Callback-Funktion für die LogOut Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.home = function () {
        $scope.userID = '';
        $scope.screen ='Login';
    }
});