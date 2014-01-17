describe( "ElementMap", function () {

   describe( "when adding an element", function () {

      var recievedName = "";
      var recievedElement;
      var map = new ElementMap();
      var element = {}
      map.onElementAdded = function(name, element){
         recievedName = name;
         recievedElement = element

      }

      map.add( element ).with( "e2" );

      describe( "the add method", function () {

         it( "should return ElementMapping", function () {
            expect( map.add() instanceof ElementMapping ).toBeTruthy();
         } );
      } );

      describe( "the has method", function () {

         it( "should return false for unregistered element", function () {
            expect( map.has( "e1" ) ).toBeFalsy();
         } );

         it( "should return true for registered element", function () {
            expect( map.has( "e2" ) ).toBeTruthy();
         } );
      } );

      describe( "the onElementAdded event", function () {

         it( "should be called", function () {
            expect(recievedName ).not.toEqual( "" );
         } );

         it( "should pass the element name", function () {
            expect(recievedName ).toEqual( "e2" );
         } );

         it( "should pass the element", function () {
            expect(recievedElement ).toEqual( element );
         } )

      } );
   } );

   describe( "when removing an element", function () {

      var map = new ElementMap();
      map.add( {} ).with( "e1" );
      map.add( {} ).with( "e2" );

      describe( "the has method", function () {

         it( "should return false for removed element", function () {
            map.remove( "e1" );
            expect( map.has( "e1" ) ).toBeFalsy();
         } );

         it( "should return true for unremoved element", function () {
            expect( map.has( "e2" ) ).toBeTruthy();
         } );
      } );
   } );

   describe( "when accessing a property", function () {

      var map = new ElementMap();
      map.add( {clientWidth: 20, clientHeight: 50} ).with( "e1" );
      map.add( {clientWidth: 33, clientHeight: 24} ).with( "e2" );
      map.add( {width: 67, height: 12} ).with( "e3" );

      describe( "the for method", function () {

         it( "should return ElementMapping", function () {
            expect( map.for() instanceof ElementMapping ).toBeTruthy();
         } );
      } );

      describe( "the get method", function () {

         it( "should return 33 for clientWidth on e1", function () {
            expect( map.for("e1" ).get("clientWidth") ).toEqual( 20 )
         } );

         it( "should return undefined for non-existent clientWidth on e3", function () {
            expect( map.for("e3" ).get("clientWidth") ).toBeUndefined();
         } );

         it( "should return undefined for non-existent element", function () {
            expect( map.for("e5" ).get("clientWidth") ).toBeUndefined();
         } );
      } );
   } );

   describe( "when setting a property", function () {

      var map = new ElementMap();
      map.add( {clientWidth: 20, clientHeight: 50} ).with( "e1" );
      map.for("e1" ).set("clientWidth", 3);
      map.for("e1" ).set("testing", 66);

      describe( "the set method", function () {

         it( "should set value 3 for clientWidth", function () {
            expect( map.for("e1" ).get("clientWidth" ) ).toEqual( 3 ) ;
         } );

         it( "should create undefined property testing and set value at 66", function () {
            expect( map.for("e1" ).get("testing") ).toEqual( 66 );
         } );

         it( "should fail silently for a non existent element", function () {
            map.for("e2" ).set("testing", 66);
         } );
      } );
   } );

   xdescribe( "when calling a method", function () {

      var map = new ElementMap();
      map.add( {test:function(value1, value2){return value1 + value2}} ).with( "e1" );
      map.add(  ).with( "e2" );


      describe( "the call method", function () {

         it( "should return sum of values passed as argument", function () {
            expect( map.for("e1" ).call("test",[10,20])).toEqual(30 )
         } );

         it( "should return undefined for non-existent method on e2", function () {
            expect( map.for("e2" ).call("test",[10,20]) ).toBeUndefined();
         } );

         it( "should return undefined for non-existent element", function () {
            expect( map.for("e5" ).get("clientWidth") ).toBeUndefined();
         } );
      } );
   } );


} );
