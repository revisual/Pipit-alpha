'use strict';

/* jasmine specs for services go here */

describe( 'ChangeBook', function () {
   beforeEach( module( 'app.services' ) );


   describe( 'when to method is called ', function () {
      var changeBook;
      var pageData;
      var $httpBackend;
      var urls = ["a", "b", "c"]

      beforeEach( inject( function ( $injector, ChangeBook, PageData ) {
         changeBook = ChangeBook;
         pageData = PageData

         spyOn( pageData, "load" );

         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when( 'GET', '/api/x/y/' ).respond( {urls: urls} );
      } ) );

      afterEach( function () {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
      } );

      it( "should call the api", function () {
         $httpBackend.expectGET( '/api/x/y/' );
         changeBook.to( "x", "y" );
         $httpBackend.flush();
      } );

      it( "should set the ", function () {
         $httpBackend.expectGET( '/api/x/y/' );
         changeBook.to( "x", "y" );
         $httpBackend.flush();
         expect( pageData.load ).toHaveBeenCalledWith( urls.reverse() )
      } )

   } );
} );
