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
      }
      return o;

   } )

   .factory( 'BookService', function ( $http, WindowService ) {

      var getSize = function () {
         var size = Math.max( WindowService.width, WindowService.height );

         if (size < 768) {
            size = 768;
         }

         else if (size < 992) {
            size = 992;
         }

         else if (size < 1200) {
            size = 1200;
         }

         else {
            size = 1620;
         }

         return size;
      }

      return {
         getData: function ( project, book ) {
            return $http.get( '/api/' + project + '/' + book + '/' + getSize() + '/' )
               .then( function ( result ) {
                  return result.data;
               } );
         }
      }
   } )

   .factory( 'ChangeBook', function ( BookService, PageData, $location ) {

      return {
         to: function ( project, book ) {
            BookService.getData( project, book )
               .then( function ( data ) {
                  PageData.load( data.urls.reverse() );
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

      var renderFunctions = [];
      var active = false;
      var tick = function () {
         if (!active) return;
         FrameService( tick );
         render();
      }

      var render = function () {
         var len = renderFunctions.length;
         for (var i = 0; i < len; i++) {
            renderFunctions[i]();
         }
      };

      return {

         addRender: function ( func ) {
            renderFunctions.push( func );
         },

         start: function () {
            if (active)return;
            active = true;
            tick();
         },

         stop: function () {
            if (!active)return;
            active = false;
         }

      }
   } )

   .factory( 'flick', function ( PageData, CanvasService, WindowService ) {

      WindowService.resize.add( function ( width, height ) {
         CanvasService.resize( width, height );
      } );

      return {
         on: PageData.on,

         setPageValue: function ( value ) {
            PageData.setPageNumber( Math.round( value * PageData.getTotalLoadedPages() ) );
            CanvasService.redraw();
         },

         getTotalPages: function () {
            return PageData.getTotalPages();
         },

         redraw: function () {
            CanvasService.redraw( WindowService.width, WindowService.height );
         }
      }
   } )

   .factory( 'PageData', function ( ImageService ) {

      var _pageNumber = 1;

      return{
         on: ImageService.on,

         getTotalLoadedPages: function () {
            return ImageService.numberLoadedImages;
         },

         getTotalPages: function () {
            return ImageService.totalNumberImages;
         },

         getWidth: function () {
            if (ImageService.images.length === 0)return 0;
            return ImageService.images[_pageNumber - 1].width;
         },

         getHeight: function () {
            if (ImageService.images.length === 0)return 0;
            return ImageService.images[_pageNumber - 1].height;
         },

         setPageNumber: function ( value ) {
            _pageNumber = Math.max( 1, Math.min( value, ImageService.images.length ) );
         },

         getCurrentImage: function () {
            if (ImageService.images.length === 0)return new Image();
            return ImageService.images[_pageNumber - 1];
         },

         load: function ( urls ) {
            ImageService.resetWith( urls );
            ImageService.start();
         }
      }
   } )

   .factory( "FrameService", function ( $window ) {
      return  $window.requestAnimationFrame ||
         $window.webkitRequestAnimationFrame ||
         $window.mozRequestAnimationFrame ||
         $window.oRequestAnimationFrame ||
         $window.msRequestAnimationFrame ||
         function ( callback ) {
            $window.setTimeout( callback, 1000 / 60 );
         };

   } )

   .factory( 'CanvasService', function ( PageData, ElementMap ) {

      return {

         init: function () {

            this.width = 0;
            this.height = 0;
            this.x = 0;
            var _context;
            var _that = this;

            this.redraw = function ( w, h ) {
               if (PageData.getTotalLoadedPages() === 0)return;
               var img = PageData.getCurrentImage();
               if (this.height == 0 || isNaN( this.height )) {
                  calculateDims( w, h );
                  applyDims();
               }
               _context.drawImage( img, 0, 0, PageData.getWidth(), PageData.getHeight(), 0, 0, this.width, this.height );
            }

            this.resize = function ( w, h ) {
               calculateDims( w, h );
               applyDims();
               this.redraw();
            }

            var calculateDims = function ( w, h ) {
               _that.height = h;
               _that.width = PageData.getWidth() * (_that.height / PageData.getHeight());
               _that.x = (w - _that.width) * 0.5;

            }

            var applyDims = function () {
               var name = "canvas";
               ElementMap.for( name ).set( "width", _that.width );
               ElementMap.for( name ).set( "height", _that.height );
               ElementMap.for( name ).setCSS( "left", _that.x + 'px' );
            }

            var onElementAdded = function ( name, element ) {

               if (name === "canvas") {
                  _context = element.getContext( '2d' );
               }


            }

            ElementMap.onElementAdded = onElementAdded;
            return this;
         }


      }.init();


   } )

   .value( 'ImageService', new ImageListLoader() )

   .value( 'ElementMap', new ElementMap() );


