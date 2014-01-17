'use strict';

/* jasmine specs for services go here */

describe( 'BookService', function () {

   beforeEach( module( 'app.services' ) );

   describe( 'when getData is called ', function () {
      var $httpBackend
      var bookService;

      beforeEach( inject( function ( $injector, BookService ) {
         bookService = BookService;
         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when('GET', '/api/p/b/').respond({message: 'testingPB'});
         $httpBackend.when('GET', '/api/x/y/').respond({message: 'testingXY'});
      } ) );

      afterEach( function () {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
      } );

      describe("it should return value depending on arguments passed",function(){

         it( 'should return message of testingPB when args are p and b', function () {
            var dataReceived = "";
            $httpBackend.expectGET( '/api/p/b/' );
            bookService.getData("p","b")
               .then( function ( data ) {
                  dataReceived = data;
               } );
            $httpBackend.flush();
            expect( dataReceived.message ).toEqual( "testingPB" );
         } );

         it( 'should return message of testingXY when args are x and y', function () {
            var dataReceived = "";
            $httpBackend.expectGET( '/api/x/y/' );
            bookService.getData("x","y")
               .then( function ( data ) {
                  dataReceived = data;
               } );
            $httpBackend.flush();

            expect( dataReceived.message ).toEqual( "testingXY" );
         } );
      })

   } );
} );
