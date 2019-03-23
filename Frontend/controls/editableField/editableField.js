function EditableFieldController($scope, $element, $attrs) {
  var ctrl = this;
  ctrl.editMode = false;

  //toggles edit mode and triggers update function of upper module when leaving editmode
  ctrl.handleModeChange = function() {
    if (ctrl.editMode) {
      ctrl.onUpdate({value: ctrl.fieldValue});
      ctrl.fieldValueCopy = ctrl.fieldValue;
    }
    ctrl.editMode = !ctrl.editMode;
  };

  //resets the fields value to previous value
  ctrl.reset = function() {
    ctrl.fieldValue = ctrl.fieldValueCopy;
  };

  //init hook of this controllers, set default values if no value was passed
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
  templateUrl: 'controls/editableField/editableField.html',
  controller: EditableFieldController,
  bindings: {
    fieldValue: '=', //value to be shown
    fieldType: '@?',  //type of the field, default string
    editable: '<?', //should this control show edit button, default false
    onUpdate: '&' //method to update value in upper module, signature onUpdate(value)
  }
});