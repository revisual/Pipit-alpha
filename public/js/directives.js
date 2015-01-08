'use strict';
angular.module( 'app.directives', [] )


   .directive( 'progbar', function () {
      return {

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
   .directive( 'slideshow', function ( tick, flick ) {
      return {
         template: "<div ref='overlay'/>",
         restrict: "E",

         link: function ( scope, element, attribs ) {
            var iWidth = 0,
               iHeight = 0,
               cachedURL = "",
               cachedAlpha = 0,


               setImage = function ( e, url, w, h, a ) {

                  e.css( {
                     'background-image': 'url(' + url + ')',
                     'background-size': w + 'px ' + h + 'px ',
                     'opacity': a
                  } );

               },

               setElementAlpha = function ( e, a ) {

                  e.css( {
                     'opacity': a
                  } );

               },

               calcDims = function () {
                  if( iHeight != 0 && iWidth != 0)return;
                  iHeight = element.height();
                  iWidth = flick.getWidth() * (iHeight / flick.getHeight());

                  if (iWidth > element.width()) {
                     iWidth = element.width();
                     iHeight = flick.getHeight() * (iWidth / flick.getWidth());
                  }


               },


               apply = function () {

                  var url = flick.getCurrentImageURL(),
                     alpha = flick.getOverlayAlpha();

                  calcDims();

                  if (cachedURL != url) {
                     setImage( element, flick.getCurrentImageURL(), iWidth, iHeight, 1 );
                     setImage( scope.overlay, flick.getOverlayImageURL(), iWidth, iHeight, alpha );
                  }

                  else if (cachedAlpha != alpha) {
                     setElementAlpha( scope.overlay, alpha );
                  }


                  cachedURL = url;
                  cachedAlpha = alpha;
               };

            //calcDims();
            scope.overlay.addClass( attribs.class );

            tick.addRender( function () {
               apply();
            } );


         }
      }
   } )


   .directive( 'slider', function ( $document, $swipe, WindowService ) {

      return {
         restrict: "E",

         link: function ( scope, element, attrib ) {
            var width = WindowService.width,
               sliderTrackWidth = Math.min( width, attrib.maxwidth ),
               targetPosition = 0,
               previousPoint = 0,
               previousPosition = 0;

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

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function mouseEnd() {
               $document.unbind( 'mousemove', mouseMove );
               $document.unbind( 'mouseup', mouseEnd );
            }

            function start( pos ) {
               scope.$apply( function () {
                  scope.active = true;
               } );
               previousPoint = pos.x / sliderTrackWidth;
               previousPosition = targetPosition;
            }

            function end( pos ) {

            }

            function move( pos ) {
               var currentPoint = pos.x / sliderTrackWidth;
               targetPosition = previousPosition + (currentPoint - previousPoint);
               targetPosition = (targetPosition < 0) ? 0 : (targetPosition > 1) ? 1 : targetPosition;
               TweenMax.to( scope, 4, {sliderValue: targetPosition, ease: Sine.easeOut, onComplete: complete} );
            }

            function complete() {
               scope.$apply( function () {
                  scope.active = false;
               } );
            }


         }
      }
   } )

   .directive( 'ref', function () {
      return {
         link: function ( scope, element, attrs ) {
            scope[attrs.ref] = element;

            // we should clean up to avoid memory leaks
            element.on( '$destroy', function () {
               scope[attrs.ref] = null;
            } );
         }
      }
   } );








