function StarRatingController($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.editMode = false;
  
    //toggles edit mode and triggers update function of upper module when leaving editmode
    ctrl.handleModeChange = function() {
      if (ctrl.editMode) {
        ctrl.onUpdate({value: ctrl.ratingValue});
        ctrl.fieldValueCopy = ctrl.ratingValue;
      }
      ctrl.editMode = !ctrl.editMode;
    };
  
    //resets the fields value to previous value
    ctrl.reset = function() {
      ctrl.ratingValue = ctrl.fieldValueCopy;
      ctrl.updateStars();
    };

    //toggle the selected stars, update rating value and drow stars according to rating level
    ctrl.toggle = function (index) {
      if (ctrl.editMode) {
        ctrl.ratingValue = index + 1;
        ctrl.updateStars();
      }
    };
  
    //init hook of this controllers, set default values if no value was passed
    ctrl.$onInit = function() {
      // Make a copy of the initial value to be able to reset it later
      ctrl.fieldValueCopy = ctrl.ratingValue;
  
      // Set a default fieldType
      if (!ctrl.maxStars) {
        ctrl.maxStars = '5';
      }
      if (!ctrl.editable) {
        ctrl.editable = false;
      }
      ctrl.updateStars();
    };

    //update star view to the current raing value
    ctrl.updateStars = function () {
        ctrl.stars = [];
        for (var i = 0; i < ctrl.maxStars; i++) {
            ctrl.stars.push({
                filled: i < ctrl.ratingValue
            });
        }
    };
  }
  
  angular.module('VDILionExample').component('starRating', {
    templateUrl: './controls/starRatingControl/starRating.html',
    controller: StarRatingController,
    bindings: {
      ratingValue: '=', //value of the rating (number of filled stars)
      maxStars: '<?', //maximum rating (total number of shown stars, default 5)
      editable: '<?', //should this control show eitbuttons?, deafult false
      onUpdate: '&' //method to update value in upper module, signature onUpdate(value)
    }
  });