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


   .directive( 'slider', function ( $document, $swipe, ResizeService ) {
      return {
         restrict: "E",
         require: '?ngModel',
         link: function ( scope, element, attr, ngModel ) {
            var startX = 0, width = ResizeService.width, height = ResizeService.height, x = 0;


            ResizeService.signal.add( function ( w, h ) {
               width = w;
               height = h;
               var n = attr.value / attr.max;
               x = (width - 50) * n;
               element.css( {
                  left: x + 'px'
               } );
            } );

            if (attr.touchenabled == "true") {
               // touch events detected
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
               var n = x / (width - 50);
               var v = (Math.floor( (attr.max - 1) * n ) + 1)
               if (attr.value != v) {
                  attr.value = v;
                  scope.$apply( function () {
                     ngModel.$setViewValue( attr.value );
                  } );
               }

               x = pos.x - startX;
               x = Math.max( 0, x );
               x = Math.min( x, width - 50 );
               element.css( {
                  left: x + 'px'
               } );
            }


            function mouseEnd() {
               $document.unbind( 'mousemove', mouseMove );
               $document.unbind( 'mouseup', mouseEnd );
            }
         }
      }
   } );





