'use strict';

/* jasmine specs for services go here */

describe( 'service', function () {

   beforeEach( module( 'app.services' ) );

   describe( 'ProjectService', function () {
      var $httpBackend;
      var projectService;

      beforeEach( inject( function ( $injector, ProjectService ) {
         projectService = ProjectService;
         $httpBackend = $injector.get( '$httpBackend' );
         $httpBackend.when('GET', '/api/get-projects/').respond({message: 'testing'});
      } ) );

      afterEach( function () {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
      } );

      it( 'should return values', function () {
         var dataReceived = "";
         $httpBackend.expectGET( '/api/get-projects/' );
         projectService.getData()
            .then( function ( data ) {
               dataReceived = data;
            } );
         $httpBackend.flush();
         expect( dataReceived.message ).toEqual( "testing" );
      } );
   } );
} );
