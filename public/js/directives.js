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


   .directive( 'slider', function ( $document, ResizeService ) {
      return {
         restrict: "E",
         require: '?ngModel',
         link: function ( scope, element, attr, ngModel ) {
            var startX = 0, width = ResizeService.width, height = ResizeService.height, x = 0;


            ResizeService.signal.add( function ( w, h ) {
               width = w;
               height = h;
               var n = attr.value / attr.max    ;
               x = (width - 50)  * n ;
               element.css( {
                  left: x + 'px'
               } );
            } );


            element.on( 'mousedown touchstart', function ( event ) {

               // Prevent default dragging of selected content
               event.preventDefault();
               startX = event.screenX - x;
               $document.on( 'mousemove touchmove', move );
               $document.on( 'mouseup touchend', end );
            } );

            function move( event ) {
               var n = x / (width - 50);
               var v = (Math.floor( (attr.max - 1) * n ) + 1)
               if (attr.value != v) {
                  attr.value = v;
                  scope.$apply(function() {
                     ngModel.$setViewValue(attr.value);
                  });
               }

               x = event.screenX - startX;
               x = Math.max( 0, x );
               x = Math.min( x, width - 50 );
               element.css( {
                  left: x + 'px'
               } );
            }

            function end() {
               $document.unbind( 'mousemove touchmove', move );
               $document.unbind( 'mouseup touchend', end );
            }
         }
      }
   } );





