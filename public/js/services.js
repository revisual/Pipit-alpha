'use strict';


angular.module( 'app.services', [] )
   .factory( 'ProjectService', function ( $http ) {
      return {
         getData: function () {
            return $http.get( '/api/projects/' )
               .then( function ( result ) {
                  return result.data;
               } );
         }
      }
   } )

   .factory( 'WindowService', function ( $window ) {

      var signal = new signals.Signal();
      var o = {
         signal: signal,
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

   .factory( 'ChangeBook', function ( BookService, PageData ) {
      return {
         to: function ( project, book ) {
            BookService.getData( project, book )
               .then( function ( data ) {
                  PageData.load( data.urls.reverse() );
               } );
         }
      }
   } )

   .value( 'ImageService', new ImageListLoader() )

   .value( 'ElementMap', new ElementMap() )

   .factory( 'PageData', function ( ImageService ) {
      return new PageData( ImageService );
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
               if (PageData.totalPages === 0)return;
               var img = PageData.getCurrentImage();
               if (this.height == 0 || isNaN( this.height )) {
                  calculateDims( w, h );
                  applyDims();
               }
               _context.drawImage( img, 0, 0, PageData.width, PageData.height, 0, 0, this.width, this.height );
            }

            this.resize = function ( w, h ) {
               calculateDims( w, h );
               applyDims();
               this.redraw();
            }

            var calculateDims = function ( w, h ) {
               _that.height = h;
               _that.width = PageData.width * (_that.height / PageData.height);
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


   } );


