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

   ChangeBook.fromQuery();
   // ChangeBook.to( "whitenight", "thru-the-tunnel" );

}


controllers.AccordionCtrl = function ( $scope, ProjectService ) {

   ProjectService.getData()
      .then( function ( data ) {
         $scope.groups = data.projects;
         $scope.oneAtATime = true;
      } );
}

controllers.ProgressCtrl = function ( $scope, ImageService ) {
   $scope.percent = 0;
   ImageService.on.progress.add( function ( current, total ) {
      $scope.$apply( function () {

         $scope.percent = Math.round( (current / total) * 100 );

      } );

   } );
}

controllers.PipitListCtrl = function ( $scope, ChangeBook ) {

   $scope.gotoFlick = function () {
      ChangeBook.to( $scope.group.projectID, $scope.item.bookID );
   }

}

controllers.ImageCtrl = function ( $scope, $timeout, PageData, CanvasService ) {

   $scope.data = PageData;
   $scope.sliderValue = 0;


   $scope.$watch( 'sliderValue', function () {

      PageData.pageNumber = Math.round( $scope.sliderValue * PageData.totalPages );
      CanvasService.redraw();


   } );


}


angular.module( "app.controllers", [] ).controller( controllers );





