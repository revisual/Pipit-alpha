'use strict';


angular.module( 'app.services', [] )

   .factory( 'WindowService', function ( $window ) {

      var signal = new signals.Signal();
      var o = {
         resize: signal,
         width: $window.innerWidth,
         height: $window.innerHeight,
         hasTouch: ( 'ontouchstart' in $window)
      };

      $window.onresize = function ( event ) {
         o.width = $window.innerWidth;
         o.height = $window.innerHeight;
         signal.dispatch( o.width, o.height );
      };
      return o;

   } )

   .factory( 'BookService', function ( $http, WindowService ) {

      var getSize = function () {
         var size = Math.max( WindowService.width, WindowService.height );

         if (size < 768) {
            size = 768;
         }

         else if (size < 992) {
            size = 768;
         }

         else if (size < 1200) {
            size = 992;
         }

         else {
            size = 992;
         }

         return size;
      };

      return {
         getData: function ( project, book ) {
            return $http.get( '/api/' + project + '/' + book + '/' + getSize() + '/' )
               .then( function ( result ) {
                  return result.data;
               } );
         }
      }
   } )

   .factory( 'ChangeBook', function ( BookService, flick, $location ) {

      return {
         to: function ( project, book ) {
            BookService.getData( project, book )
               .then( function ( data ) {
                  flick.load( data.urls.reverse() );
               } )
         },
         fromQuery: function () {

            var s = $location.search();
            if (s.project == null || s.book == null) {
               this.to( "whitenight", "thru-the-tunnel" );
            }

            else {
               this.to( s.project, s.book );
            }

         }
      }
   } )

   .factory( 'tick', function ( FrameService ) {
      var lastTime = 0;
      var interval = 1000 / 60;
      var renderFunctions = [];
      var delta = 0;
      var active = false;
      var mean = {
         maxPush: 24,
         maxValue: 200,
         data: [],
         push: function ( value ) {
            if (value > this.maxValue)return;
            this.data.push( value );
            if (this.data.length > this.maxPush) {
               this.data.shift();
            }
         },
         getDelta: function () {
            var len = this.data.length;
            var sum = 0;
            for (var i = 0; i < len; i++) {
               sum += this.data[i];
            }
            return Math.round( sum / len );
         }
      };

      var tick = function ( time ) {
         if (!active) return;

         if (time != undefined) {
            mean.push( time - lastTime );
            delta = mean.getDelta();
            lastTime = time;
         }

         setTimeout( function () {
            FrameService( tick );
            render();

        // }, (delta > 0 && delta < 100) ? delta : interval );
         },  interval );

      };

      var render = function () {
         var len = renderFunctions.length;
         for (var i = 0; i < len; i++) {
            renderFunctions[i]();
         }
      };

      return {

         getDelta: function () {
            return delta;
         },

         addRender: function ( func ) {
            renderFunctions.push( func );
         },

         start: function () {
            if (active)return;
            active = true;
            tick();
         },

         pause: function () {
            if (!active)return;
            active = false;
         }

      }
   } )


   .factory( 'flick', function ( ImageService ) {

      var _pageNumber = 0;
      var _remainder = 0;

      return {
         on: ImageService.on,

         getTotalLoadedPages: function () {
            return ImageService.numberLoadedImages;
         },

         /* getTotalPages: function () {
          return ImageService.totalNumberImages;
          },*/

         getWidth: function () {
            if (ImageService.images.length == 0)return 0;
            if (ImageService.images[_pageNumber] == undefined)return 0;
            return ImageService.images[_pageNumber].width;
         },

         getHeight: function () {
            if (ImageService.images.length == 0)return 0;
            if (ImageService.images[_pageNumber] == undefined)return 0;
            return ImageService.images[_pageNumber].height;
         },

         setPageValue: function ( value ) {
            var v = value * ImageService.numberLoadedImages;
            // console.log( _pageNumber );
            _pageNumber = Math.floor( v );
            _remainder = v - _pageNumber
         },

         /* getCurrentImage: function () {
          if (ImageService.images.length === 0)return new Image();
          return ImageService.images[_pageNumber - 1];
          },*/

         getCurrentImageURL: function () {
            if (ImageService.images.length == 0)return "";
            if (ImageService.images[_pageNumber] == undefined)return "";
            return ImageService.images[_pageNumber].src;
         },

         getOverlayImageURL: function () {
            if (ImageService.images.length == 0)return "";
            if (ImageService.images[_pageNumber + 1] == undefined)return "";
            return ImageService.images[_pageNumber + 1].src;
         },

         getOverlayAlpha: function () {
            return _remainder;
         },

         load: function ( urls ) {
            ImageService.resetWith( urls );
            ImageService.start();
         }
      }
   } )

   .factory( "FrameService", function ( $window ) {
      // requestAnimationFrame polyfill by Erik Möller
      // fixes from Paul Irish and Tino Zijdel
      (function () {
         var lastTime = 0;
         var vendors = ['ms', 'moz', 'webkit', 'o'];
         for (var x = 0; x < vendors.length && !$window.requestAnimationFrame; ++x) {
            $window.requestAnimationFrame = $window[vendors[x] + 'RequestAnimationFrame'];
            $window.cancelAnimationFrame = $window[vendors[x] + 'CancelAnimationFrame']
            || $window[vendors[x] + 'CancelRequestAnimationFrame'];
         }

         if (!$window.requestAnimationFrame)
            $window.requestAnimationFrame = function ( callback, element ) {
               var currTime = new Date().getTime();
               var timeToCall = Math.max( 0, 16 - (currTime - lastTime) );

               var id = $window.setTimeout( function () {
                     callback( currTime + timeToCall );
                  },
                  timeToCall );
               lastTime = currTime + timeToCall;
               return id;
            };

         if (!$window.cancelAnimationFrame)
            $window.cancelAnimationFrame = function ( id ) {
               clearTimeout( id );
            };
      }());
      return $window.requestAnimationFrame

   } )

   .factory( 'screen', function ( flick ) {

      return {

         init: function () {

            this.width = 0;
            this.height = 0;
            this.x = 0;

            var _that = this;

            this.redraw = function ( w, h ) {
               if (flick.getTotalLoadedPages() === 0)return;
               //var img = flick.getCurrentImage();
               if (this.height == 0 || isNaN( this.height )) {
                  calculateDims( w, h );
                  applyDims();
               }
               //drawImage( img, 0, 0, PageData.getWidth(), PageData.getHeight(), 0, 0, this.width, this.height );
            };

            this.resize = function ( w, h ) {
               calculateDims( w, h );
               applyDims();
               this.redraw();
            };

            var calculateDims = function ( w, h ) {
               _that.height = h;
               _that.width = flick.getWidth() * (_that.height / flick.getHeight());
               _that.x = (w - _that.width) * 0.5;

            };

            var applyDims = function () {
               /* var name = "canvas";
                set( "width", _that.width );
                set( "height", _that.height );
                for( name ).setCSS( "left", _that.x + 'px' );*/
            };

            //ElementMap.onElementAdded = onElementAdded;
            return this;
         }


      }.init();


   } )

   .value( 'ImageService', new ImageListLoader() );



