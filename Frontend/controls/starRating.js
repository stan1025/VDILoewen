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
    template: '<span ng-switch="$ctrl.editMode"> \
                <i ng-repeat="star in $ctrl.stars" ng-class="star.filled ? \'fa fa-star\' : \'fa fa-star-o\'" ng-click="$ctrl.toggle($index)"></i>\
                <span ng-switch-default>{{$ctrl.fieldValue}}</span> \
              </span> \
              <button ng-show="$ctrl.editable" ng-click="$ctrl.handleModeChange()" ng-class="$ctrl.editMode ? \'fa fa-save\' : \'fa fa-edit\'" class="vdi-button-symbol"></button> \
              <button ng-if="$ctrl.editMode" ng-click="$ctrl.reset()" class="fa fa-undo vdi-button-symbol"></button>',
    controller: StarRatingController,
    bindings: {
      ratingValue: '=',
      maxStars: '<?',
      editable: '<',
      onUpdate: '&'
    }
  });