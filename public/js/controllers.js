'use strict';

var controllers = {};


controllers.AppCtrl = function ( ResizeService, CanvasService, ChangeBook, ImageService, PageData ) {

   ImageService.on.firstResolved.add( function () {
      if (PageData.pageNumber === 1) {
         CanvasService.redraw( ResizeService.width, ResizeService.height );
      }
      PageData.pageNumber = 1;
   } );


   ResizeService.signal.add( function ( width, height ) {
      CanvasService.resize( width, height );
   } );


   ChangeBook.to( "whitenight", "thru-the-tunnel" );

}


controllers.AccordionCtrl = function ( $scope, ProjectService ) {

   ProjectService.getData()
      .then( function ( data ) {
         $scope.groups = data.projects;
         $scope.oneAtATime = true;
      } );
}

controllers.ProgressCtrl = function ( $scope, ImageService ) {
   $scope.data = ImageService;
}

controllers.PipitListCtrl = function ( $scope, ChangeBook ) {

   $scope.gotoFlick = function () {
      ChangeBook.to( $scope.group.projectID, $scope.item.bookID );
   }

}

controllers.ImageCtrl = function ( $scope, $timeout, PageData, CanvasService ) {

   $scope.data = PageData;
   $scope.currentTargetPosition = 0;
   $scope.currentPosition = 0;
   $scope.velocity = 0;
   $scope.active = false;

   $scope.onTimeout = function () {

      var increment = 0;

      $scope.velocity += Math.abs( ($scope.currentTargetPosition - $scope.currentPosition) * 0.01 );


      if ($scope.velocity >= 1) {
         increment = 1;
         $scope.velocity = 0;
         $scope.currentPosition = ( $scope.currentTargetPosition > $scope.currentPosition) ? $scope.currentPosition + increment : $scope.currentPosition - increment;

         PageData.pageNumber = $scope.currentPosition;
         CanvasService.redraw();
      }

      $scope.active = ($scope.currentPosition != $scope.currentTargetPosition);

      if ($scope.active) {
         $scope.timeout = $timeout( $scope.onTimeout, 10 );
      }

   }

   $scope.$watch( 'currentTargetPosition', function () {
      if ($scope.active) {
         return;
      }

      $scope.active = true;
      console.log( "start" );
      $scope.timeout = $timeout( $scope.onTimeout, 1 );

   } );


}


angular.module( "app.controllers", [] ).controller( controllers );





