  function SkillDetailController() {
    var ctrl = this;
    
      ctrl.delete = function() {
        ctrl.onDelete({skill: ctrl.skill});
      };
    
      ctrl.update = function(prop, value) {
        ctrl.onUpdate({skill: ctrl.skill, prop: prop, value: value});
      };
    }

    angular.module('VDILionExample').component('skillDetail', {
    templateUrl: './controls/skillDetailView/skillDetailView.html',
    controller: SkillDetailController,
    bindings: {
      skill: '=',
      editable: '<',
      onDelete: '&',
      onUpdate: '&'
    }
  });