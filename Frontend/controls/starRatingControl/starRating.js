function StarRatingController($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.editMode = false;
  
    ctrl.handleModeChange = function() {
      if (ctrl.editMode) {
        ctrl.onUpdate({value: ctrl.ratingValue});
        ctrl.fieldValueCopy = ctrl.ratingValue;
      }
      ctrl.editMode = !ctrl.editMode;
    };
  
    ctrl.reset = function() {
      ctrl.ratingValue = ctrl.fieldValueCopy;
      ctrl.updateStars();
    };

    ctrl.toggle = function (index) {
      if (ctrl.editMode) {
        ctrl.ratingValue = index + 1;
        ctrl.updateStars();
      }
    };
  
    ctrl.$onInit = function() {
      // Make a copy of the initial value to be able to reset it later
      ctrl.fieldValueCopy = ctrl.ratingValue;
  
      // Set a default fieldType
      if (!ctrl.maxStars) {
        ctrl.maxStars = '5';
      }
      ctrl.updateStars();
    };

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
      ratingValue: '=',
      maxStars: '<?',
      editable: '<',
      onUpdate: '&'
    }
  });