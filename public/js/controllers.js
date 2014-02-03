'use strict';

var controllers = {};


controllers.AppCtrl = function ( WindowService, CanvasService, ChangeBook, ImageService, PageData ) {

   ImageService.on.firstResolved.add( function () {
      if (PageData.getPageNumber() === 1) {
         CanvasService.redraw( WindowService.width, WindowService.height );
         $( "#progbarContainer" ).addClass( "in" );
         $( "#contentContainer" ).addClass( "in" );
      }
      PageData.setPageNumber( 1 );
   } );

   WindowService.resize.add( function ( width, height ) {
      CanvasService.resize( width, height );
   } );

   ChangeBook.fromQuery();
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
         if ($scope.percent == 100) {
            $( "#progbarContainer" ).removeClass( "in" );
         }

      } );

   } );
}

controllers.PipitListCtrl = function ( $scope, ChangeBook ) {

   $scope.gotoFlick = function () {
      ChangeBook.to( $scope.group.projectID, $scope.item.bookID );
   }

}

controllers.ImageCtrl = function ( $scope, tick, PageData, CanvasService ) {

   $scope.sliderValue = 0;
   $scope.totalPages = 0;
   $scope.active = false;

   PageData.on.complete.add( function () {
      $scope.totalPages = PageData.getTotalPages();
   } );

   tick.addRender( function () {
      PageData.setPageNumber( Math.round( $scope.sliderValue * PageData.getTotalLoadedPages() ) );
      CanvasService.redraw();
   } );


   $scope.$watch( 'active', function () {
      if ($scope.active) {
         tick.start();
      }

      else {
         tick.stop();
      }
   } );


}


angular.module( "app.controllers", [] ).controller( controllers );





