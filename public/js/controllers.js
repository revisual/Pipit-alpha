'use strict';

var controllers = {};


controllers.AppCtrl = function ( ChangeBook, flick ) {

   flick.on.firstResolved.add( function () {
        // flick.redraw( );
         $( "#progbarContainer" ).addClass( "in" );
         $( "#contentContainer" ).addClass( "in" );
   } );

   ChangeBook.fromQuery();
};


controllers.ProgressCtrl = function ( $scope, flick ) {
   $scope.percent = 0;
   flick.on.progress.add( function ( current, total ) {
      $scope.$apply( function () {
         $scope.percent = Math.round( (current / total) * 100 );
         if ($scope.percent == 100) {
            $( "#progbarContainer" ).removeClass( "in" );
         }
      } );

   } );
};

controllers.ImageCtrl = function ( $scope, tick, flick ) {

   $scope.sliderValue = 0;
   $scope.active = false;

   tick.addRender( function () {
      flick.setPageValue( $scope.sliderValue );
   } );

   $scope.$watch( 'active', function () {

      if ($scope.active) {
         tick.start();
      }

      else {
         tick.stop();
      }
   } );

};


angular.module( "app.controllers", [] ).controller( controllers );





