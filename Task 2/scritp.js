/*it is incompleted as i still have some problems
 with some things, but i'll do it!*/ 
var app = angular.module('form-example1', []);
'use strict';
app.controller('formCtrl',['$scope', function($scope){
  $scope.submit=function(){
var user ={
  'username': $scope.user.name,
  'age':$scope.age,
  'date':$scope.date
};
$scope.form.$setPristine();//This method sets the form's $pristine state to true, the $dirty state to false, removes the ng-dirty class and adds the ng-pristine class. Additionally, it sets the $submitted state to false.
}
}]);

var DATE_REGEXP = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
app.directive('date', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.date = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          alert("Enter the date,please!");
        }

        if (DATE_REGEXP.test(viewValue)) {
   
          return true;
        }

       return false;
      };
    }
  };
});




var USER_REGEXP=/^[a-zA-z]+$/;
var FIRST_LETTER=/^[A_Z]+$/;
app.directive('username', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
   ctrl.$validators.username = function(modelValue, viewValue) {
      if (ctrl.$isEmpty(modelValue)){
        return true;
      }

          if (USER_REGEXP.test(viewValue)) {
            var isValid=false;{
         if (FIRST_LETTER.test(name[0])){
          isValid=true;
         } else {
          isValid =false;
         }
  }; return isValid; }
return false;
}
      }
    }
  });

