  function SkillDetailController() {
    var ctrl = this;
    
    //pass to upper module which skill has to be deleted
      ctrl.delete = function() {
        ctrl.onDelete({skill: ctrl.skill});
      };
    
      //pass to list controller which skill has to be updated to which value
      ctrl.update = function(prop, value) {
        ctrl.onUpdate({skill: ctrl.skill, prop: prop, value: value});
      };
    }

    angular.module('VDILionExample').component('skillDetail', {
    templateUrl: './controls/skillDetailView/skillDetailView.html',
    controller: SkillDetailController,
    bindings: {
      skill: '=', //skill with experienceLevel
      editable: '<', //should the edit button been shown?
      onDelete: '&', //delete function of upper module
      onUpdate: '&' //update function of upper module
    }
  });