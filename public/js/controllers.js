'use strict';

var controllers = {};


controllers.AppCtrl = function ( WindowService, CanvasService, ChangeBook, ImageService, PageData ) {

   ImageService.on.firstResolved.add( function () {
      if (PageData.pageNumber === 1) {
         CanvasService.redraw( WindowService.width, WindowService.height );
      }
      PageData.pageNumber = 1;
   } );


   WindowService.signal.add( function ( width, height ) {
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
   $scope.interval = 1;

   $scope.onTimeout = function () {

      var increment = 0;

      $scope.velocity += 1;//Math.abs( ($scope.currentTargetPosition - $scope.currentPosition) * 0.01 );


      if ($scope.velocity >= 1) {
         var start = new Date().getTime();

         increment = 1;
         $scope.velocity = 0;
         $scope.currentPosition = ( $scope.currentTargetPosition > $scope.currentPosition) ? $scope.currentPosition + increment : $scope.currentPosition - increment;

         PageData.pageNumber = $scope.currentPosition;


         CanvasService.redraw();

         var time = new Date().getTime() - start;

         $scope.interval = ( $scope.interval + time ) * 0.5;

      }

      $scope.active = ($scope.currentPosition != $scope.currentTargetPosition);

      if ($scope.active) {
         $scope.timeout = $timeout( $scope.onTimeout, $scope.interval );
      }

   }

   $scope.$watch( 'currentTargetPosition', function () {
      if ($scope.active) {
         return;
      }

      $scope.active = true;
     // console.log( "start interval = " + $scope.interval);
      $scope.timeout = $timeout( $scope.onTimeout, $scope.interval );

   } );


}


angular.module( "app.controllers", [] ).controller( controllers );





