var app = angular.module('VDILionExample', ['ngCookies']);
const server = "http://localhost:3000";

app.controller('ProfileController', function ($scope, $cookies) {
    ctrl = this;
    //Initialwerte schreiben
    $scope.title = 'Benutzerprofil';
    $scope.screen = $cookies.get('Screen');
    if (!$scope.screen)
        $scope.screen = 'Login';
    $scope.userID = $cookies.get('UserID');
    if (!$scope.userID)
        $scope.userID = '';


    $scope.setScreen = function (screen, callMyFunc) {
        $scope.screen = screen;
        $cookies.put('Screen', $scope.screen);
        if (callMyFunc)
            myFunction();
    }

    //Callback-Funktion für die LogIn Seite, setzt den aktiven Benutzer und schaltet die Seite um
    $scope.login = function (user) {
        $scope.userID = user;
        $cookies.put('UserID', $scope.userID);
        $scope.screen = 'Userprofile';
    }

    //Callback-Funktion für die Member Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.logout = function () {
        $scope.userID = '';
        $cookies.put('UserID', $scope.userID);
        $scope.screen = 'Logout';
        $cookies.put('Screen', $scope.screen);
    }

    //Callback-Funktion für die LogOut Seite, setzt den aktiven Benutzer zurück und schaltet die Seite um
    $scope.home = function () {
        $scope.userID = '';
        $cookies.put('UserID', $scope.userID);
        $scope.screen = 'Login';
        $cookies.put('Screen', $scope.screen);
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


