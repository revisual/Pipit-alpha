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


   .directive( 'slider', function ( $document, $swipe, WindowService, FrameService ) {
      return {
         restrict: "E",

         link: function ( scope, element, attrib ) {

            var width = WindowService.width,
               sliderIconWidth = element.prop( "offsetWidth" ),
               sliderTrackWidth = Math.min( width, attrib.maxwidth ),
               gutter = (width - sliderTrackWidth) * 0.5,
               x = gutter,
               oldX = 0,
               xSpeed = 0,
               startX = 0,
               friction = 0.98,
               topSpeed = width / attrib.limitspeedby,
               interval = 33;

            element.css( {
               left: x + 'px'
            } );

            WindowService.resize.add( function ( w, h ) {
               width = w;
               topSpeed = width / attrib.limitspeedby;
               sliderTrackWidth = Math.min( width, attrib.maxwidth );
               gutter = (width - sliderTrackWidth) * 0.5;
               x = gutter + ((sliderTrackWidth - sliderIconWidth) * scope.sliderValue);
               element.css( {
                  left: x + 'px'
               } );
            } );

            scope.$watch( 'totalPages', function () {
               topSpeed = width / attrib.limitspeedby;
            } );

            if (WindowService.hasTouch) {
               $swipe.bind( element, {start: start, move: move, end: end, cancel: end} );
            }

            else {
               element.on( 'mousedown', function ( event ) {

                  event.preventDefault();
                  start( {x: event.screenX} );

                  $document.on( 'mousemove', mouseMove );
                  $document.on( 'mouseup', mouseEnd );

               } );
            }

            function start( pos ) {
               scope.$apply( function () {
                  scope.active = true;
               } );
               startX = pos.x - x;
               oldX = 0;
               xSpeed = 0;
            }

            function mouseEnd() {
               $document.unbind( 'mousemove', mouseMove );
               $document.unbind( 'mouseup', mouseEnd );

               FrameService( throwSlider, interval );
            }

            function end( pos ) {

               FrameService( throwSlider, interval );
            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function move( pos ) {

               if (!scope.active) {
                  scope.$apply( function () {
                     scope.active = true;
                  } );
               }

               if (pos == null) {
                  x += xSpeed;
                  xSpeed *= friction;
               }

               else {
                  var newX = pos.x;
                  x = pos.x - startX;
                  xSpeed = Math.min( newX - oldX, topSpeed );
                  oldX = newX;
               }

               var beforeX = x;
               x = Math.max( gutter, x );
               x = Math.min( x, width - sliderIconWidth - gutter );

               element.css( {
                  left: x + 'px'
               } );

               scope.$apply( function () {
                  scope.sliderValue = (x - gutter) / (sliderTrackWidth - sliderIconWidth);
               } );



               return (beforeX != x);
            }


            function throwSlider() {

               if (move( null ) || xSpeed < 0.1 && xSpeed > -0.1) {
                  xSpeed = 0;
                  oldX = 0;
                  scope.$apply( function () {
                     scope.active = false;
                  } );

               }

               else {
                  FrameService( throwSlider, interval );
               }

            }


         }
      }
   } )







