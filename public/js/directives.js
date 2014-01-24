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
            element.collapse( {
               toggle: true
            } );
            element.collapse( 'show' );
            scope.widthStyle = "width: " + ngModel.$viewValue + "%;";

            ngModel.$render = function() {
               scope.widthStyle = "width: " + ngModel.$viewValue + "%;";
               if (ngModel.$viewValue === 100) {
                  element.collapse( 'toggle' );
               }
            };


         }
      }
   } )


   .directive( 'slider', function ( $document, $swipe, WindowService ) {
      return {
         restrict: "E",
         require: '?ngModel',

         link: function ( scope, element, attr, ngModel ) {

            var width = WindowService.width,
               sliderIconWidth = element.prop( "offsetWidth" ),
               sliderTrackWidth = Math.min( width, attr.maxwidth ),
               gutter = (width - sliderTrackWidth) * 0.5,
               x = gutter,
               startX = 0;

            element.css( {
               left: x + 'px'
            } );

            WindowService.signal.add( function ( w, h ) {
               width = w;
               sliderTrackWidth = Math.min( width, attr.maxwidth ) ;
               gutter = (width - sliderTrackWidth) * 0.5;
               x = gutter + ((sliderTrackWidth - sliderIconWidth) * ngModel.$viewValue);
               element.css( {
                  left: x + 'px'
               } );
            } );

            if (WindowService.hasTouch) {
               $swipe.bind( element, {start: start, move: move} );
            }

            else {
               element.on( 'mousedown', function ( event ) {

                  event.preventDefault();
                  startX = event.screenX - x;

                  $document.on( 'mousemove', mouseMove );
                  $document.on( 'mouseup', mouseEnd );

               } );
            }

            function start( pos ) {
               startX = pos.x - x;
            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function move( pos ) {

               x = pos.x - startX;
               x = Math.max( gutter, x );
               x = Math.min( x, width - sliderIconWidth - gutter );

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
            }
         }
      }
   } )







