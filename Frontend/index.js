var app = angular.module('VDILionExample', []);
const server = "http://localhost:3000";

app.controller('ProfileController', function ($scope, $http) {
    ctrl = this;
    //Initialwerte schreiben
    $scope.title = 'Benutzerprofil';
    $scope.screen = 'Login';
    $scope.userID = '';
    $scope.viewMode = 'Desktop';



    window.onresize = function (event) {
        checkViewMode();
    }

    window.onload = function (event) {
        checkViewMode();
    }


    $scope.setScreen = function (screen, callMyFunc) {
        $scope.screen = screen;
        if (callMyFunc)
            myFunction();
    }

    //Callback-Funktion für die LogIn Seite, setzt den aktiven Benutzer und schaltet die Seite um
    $scope.login = function (user) {
        $scope.userID = user;
        $scope.screen = 'Userprofile';
    }

    //Callback-Funktion für die Member Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.logout = function () {
        $scope.userID = '';
        $scope.screen = 'Logout';
    }

    //Callback-Funktion für die LogOut Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.home = function () {
        $scope.userID = '';
        $scope.screen = 'Login';
    }

    function checkViewMode() {
        if (window.innerWidth > 600) {
            $scope.viewMode = 'Desktop';
            $scope.$digest();
        }
        else {
            $scope.viewMode = 'Smartphone';
            $scope.$digest();
        }
    }
});

// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}


