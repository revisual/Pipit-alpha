'use strict';

/* Filters */

angular.module('app.filters', []).
   filter('reverseArray', [ function() {
      return function(array) {
         return array.reverse();
      }
   }]);
