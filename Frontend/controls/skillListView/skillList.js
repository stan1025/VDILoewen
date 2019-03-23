function SkillListController($scope, $element, $attrs) {
  var ctrl = this;

  //method to update a given skill, saves skilllist afterwards
  ctrl.updateSkill = function(skill, prop, value) {
    skill[prop] = value;
    ctrl.onSave();
  };

  //deletes a given skill, saves skilllist afterwards
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
    skills: '=', //list of skills
    editable: '<', //should edit butttons been shown on the list?
    onSave: '&' //save callback for upper module, signature onSave()
  }
});