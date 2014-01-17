'use strict';

describe( 'ImageService', function () {
   var imageService;

   beforeEach( module( 'app.services' ) );

   beforeEach( inject( function ( ImageService ) {
      imageService = ImageService;
   } ) );

   it( "should be instanceof ImageListLoader", function () {
      expect( imageService instanceof ImageListLoader ).toBeTruthy();
   } );

} );
