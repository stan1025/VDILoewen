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
  templateUrl: './controls/skillListView/skillListView.html',
  controller: SkillListController,
  bindings: {
    skills: '=',
    editable: '<',
    onSave: '&'
  }
});