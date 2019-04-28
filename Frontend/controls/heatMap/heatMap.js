  function HeatmapController($http) {
    var ctrl = this;
    //server as global variable in first step
    ctrl.server = server;
    ctrl.skill = '';

    var mymap = L.map('mapid').setView([51.163361,10.447683], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      useCache: true
    }).addTo(mymap);

    window.onresize = function (event) {   
      //mymap.setView([51.163361,10.447683], 6);   
      mymap.invalidateSize();
    }

    var markers = L.layerGroup().addTo(mymap);

    //search for results on server
    ctrl.search = function() {
      markers.clearLayers();
      console.log(ctrl.skill);
      $http.get(ctrl.server + "/competenceLocations", { params: {competencies: ctrl.skill}})
      .then(function (response) {
          console.log(response.data);
          var profiles = response.data;
          profiles.forEach(profile => {
            var marker = L.marker([profile.GeoData.latitude, profile.GeoData.longitude]);
              marker.bindPopup(profile.name + '<br>' + profile.job.phone + '<br>' + profile.job.email)
            // add marker
            markers.addLayer(marker);
          });
      }, function () {
          // Second function handles error
          console.log("Something went wrong 1 couch");

      })
    }

    //make enter submit the form values as well
    ctrl.keyup = function (event) {
      if (13 == event.keyCode)
      {
        ctrl.search();
      }
    }

    //load profile if user changes (e.g. login)
    ctrl.$onChanges = function (changesObj) {
      if ('' != ctrl.userId)
      {        ctrl.user = ctrl.userId;
      }
      ctrl.city = '';      
      //reset map
      mymap.invalidateSize();
      markers.clearLayers();
    }
  }

    angular.module('VDILionExample').component('heatMap', {
    templateUrl: './controls/heatMap/heatMap.html',
    controller: HeatmapController,
    bindings: {
      userId: '<', //logged in user
    }
  });