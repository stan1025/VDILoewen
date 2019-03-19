function SkillListController($scope, $element, $attrs) {
  var ctrl = this;

  ctrl.updateSkill = function(skill, prop, value) {
    skill[prop] = value;
    ctrl.onSave();
  };

  ctrl.deleteSkill = function(skill) {
    var idx = ctrl.skills.indexOf(skill);
    if (idx >= 0) {
      ctrl.skills.splice(idx, 1);
    }
    ctrl.onSave();
  };
}

angular.module('VDILionExample').component('skillList', {
  template: '<skill-detail ng-repeat="skill in $ctrl.skills" editable="$ctrl.editable" skill="skill" on-delete="$ctrl.deleteSkill(skill)" on-update="$ctrl.updateSkill(skill, prop, value)"></skill-detail>',
  controller: SkillListController,
  bindings: {
    skills: '=',
    editable: '<',
    onSave: '&'
  }
});