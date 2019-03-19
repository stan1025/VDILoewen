function EditableFieldController($scope, $element, $attrs) {
  var ctrl = this;
  ctrl.editMode = false;

  ctrl.handleModeChange = function() {
    if (ctrl.editMode) {
      ctrl.onUpdate({value: ctrl.fieldValue});
      ctrl.fieldValueCopy = ctrl.fieldValue;
    }
    ctrl.editMode = !ctrl.editMode;
  };

  ctrl.reset = function() {
    ctrl.fieldValue = ctrl.fieldValueCopy;
  };

  ctrl.$onInit = function() {
    // Make a copy of the initial value to be able to reset it later
    ctrl.fieldValueCopy = ctrl.fieldValue;

    // Set a default fieldType
    if (!ctrl.fieldType) {
      ctrl.fieldType = 'text';
    }
    if (!ctrl.editable) {
      ctrl.editable = false;
    }
  };
}

angular.module('VDILionExample').component('editableField', {
  template: ' <span ng-switch="$ctrl.editMode"> \
                <input ng-switch-when="true" type="{{$ctrl.fieldType}}" ng-model="$ctrl.fieldValue"> \
                <span ng-switch-default>{{$ctrl.fieldValue}}</span> \
              </span> \
              <button ng-show="$ctrl.editable" ng-click="$ctrl.handleModeChange()" ng-class="$ctrl.editMode ? \'fa fa-save\' : \'fa fa-edit\'" class="vdi-button-symbol"></button> \
              <button ng-if="$ctrl.editMode" ng-click="$ctrl.reset()" class="fa fa-undo vdi-button-symbol"></button>',
  controller: EditableFieldController,
  bindings: {
    fieldValue: '=',
    fieldType: '@?',
    editable: '<?',
    onUpdate: '&'
  }
});