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
    template: ' <div class="vdi-white-background vdi-boxed w3-round-xlarge vdi-star-rating"> \
                  <h6> \
                    <editable-field field-value="$ctrl.skill.name" editable="$ctrl.editable" field-type="text" on-update="$ctrl.update(\'name\', value)"></editable-field> \
                    <span class="w3-right"> \
                      <star-rating editable="$ctrl.editable" rating-value="$ctrl.skill.experienceLevel" max-stars="5" on-update="$ctrl.update(\'experienceLevel\', value)"></star-rating> \
                      <button ng-show="$ctrl.editable" ng-click="$ctrl.delete()" class="fa fa-eraser vdi-button-symbol"></button> \
                    </span> \
                  </h6> \
                </div>',
    controller: SkillDetailController,
    bindings: {
      skill: '=',
      editable: '<',
      onDelete: '&',
      onUpdate: '&'
    }
  });