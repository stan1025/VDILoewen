  function addressViewController() {
    var ctrl = this;

    //pass to upper module which skill has to be deleted
      ctrl.delete = function() {
        ctrl.onDelete({skill: ctrl.skill});
      };

      //pass to list controller which skill has to be updated to which value
      ctrl.update = function(value) {
        ctrl.onUpdate({value: value});
      };
    }

    angular.module('VDILionExample').component('addressView', {
    templateUrl: './controls/addressView/addressView.html',
    controller: addressViewController,
    bindings: {
      address: '=', //address
      editable: '<', //should the edit button been shown?
      onUpdate: '&' //update function of upper module
    }
  });