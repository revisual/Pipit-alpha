'use strict';
angular.module( 'app.directives', [] )

   .directive( 'pipitlist', [ function () {
      return {
         restrict: 'E',
         template: "<div class='panel' ng-style='getStyleObj(item)'>{{item.title}}</div>",
         link: function ( scope, element, attribs ) {
            scope.getStyleObj = function ( item ) {
               return { cursor: 'pointer'  }
            }
         }
      }
   }] )

   .directive( 'map', [ "ElementMap", function ( ElementMap ) {
      return  {
         restrict: 'A',
         link: function ( scope, element, attribs ) {
            ElementMap.add( element[0] ).with( attribs.map );
         }
      }
   }] )

   .directive( 'progbar', function () {
      return  {

         template: "<div class='progress'>" +
            "<div class='progress-bar' role='progressbar' style='{{widthStyle}}' > </div> </div>",

         restrict: 'E',
         require: '?ngModel',

         link: function ( scope, element, attribs, ngModel ) {

            scope.widthStyle = "width: " + ngModel.$viewValue + "%;";

            ngModel.$render = function () {
               scope.widthStyle = "width: " + ngModel.$viewValue + "%;";
            };
         }
      }
   } )


   .directive( 'slider', function ( $document, $swipe,  WindowService, FrameService ) {
      return {
         restrict: "E",
         require: '?ngModel',

         link: function ( scope, element, attr, ngModel ) {

            var width = WindowService.width,
               sliderIconWidth = element.prop( "offsetWidth" ),
               sliderTrackWidth = Math.min( width, attr.maxwidth ),
               gutter = (width - sliderTrackWidth) * 0.5,
               x = gutter,
               oldX = 0,
               xSpeed = 0,
               startX = 0,
               friction = 0.98,
               topSpeed = width / attr.limitspeedby,
               interval = 33;



            element.css( {
               left: x + 'px'
            } );

            WindowService.signal.add( function ( w, h ) {
               width = w;
               topSpeed = width / attr.limitspeedby;
               sliderTrackWidth = Math.min( width, attr.maxwidth );
               gutter = (width - sliderTrackWidth) * 0.5;
               x = gutter + ((sliderTrackWidth - sliderIconWidth) * ngModel.$viewValue);
               element.css( {
                  left: x + 'px'
               } );
            } );

            scope.$watch( 'totalPages', function () {
               topSpeed = width / attr.limitspeedby;
            } );

            if (WindowService.hasTouch) {
               $swipe.bind( element, {start: start, move: move, end: end, cancel: end} );
            }

            else {
               element.on( 'mousedown', function ( event ) {

                  event.preventDefault();
                  start( {x: event.screenX} );
                  //startX = event.screenX - x;

                  $document.on( 'mousemove', mouseMove );
                  $document.on( 'mouseup', mouseEnd );

               } );
            }

            function start( pos ) {
               startX = pos.x - x;
               oldX = 0;
               xSpeed = 0;
            }

            function end( pos ) {

               FrameService( throwSlider, interval );
            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function move( pos ) {

               x = pos.x - startX;
               x = Math.max( gutter, x );
               x = Math.min( x, width - sliderIconWidth - gutter );

               var newX = pos.x;
               xSpeed = Math.min( newX - oldX, topSpeed );
               oldX = newX;

               element.css( {
                  left: x + 'px'
               } );

               scope.$apply( function () {
                  ngModel.$setViewValue( (x - gutter) / (sliderTrackWidth - sliderIconWidth) );
               } );


            }


            function mouseEnd() {
               $document.unbind( 'mousemove', mouseMove );
               $document.unbind( 'mouseup', mouseEnd );

               FrameService( throwSlider, interval );
            }

            function throwSlider() {

               if (xSpeed < 0.1 && xSpeed > -0.1) {
                  xSpeed = 0;
                  return;
               }


               x += xSpeed;
               x = Math.max( gutter, x );
               x = Math.min( x, width - sliderIconWidth - gutter );

               xSpeed *= friction;

               element.css( {
                  left: x + 'px'
               } );

               scope.$apply( function () {
                  ngModel.$setViewValue( (x - gutter) / (sliderTrackWidth - sliderIconWidth) );
               } );


               FrameService( throwSlider, interval );
            }
         }
      }
   } )







