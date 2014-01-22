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


   $scope.$watch( 'currentTargetPosition', function () {

      PageData.pageNumber = $scope.currentTargetPosition;
      CanvasService.redraw();


   } );


}


angular.module( "app.controllers", [] ).controller( controllers );





