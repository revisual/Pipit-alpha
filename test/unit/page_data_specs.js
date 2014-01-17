describe( "PageData", function () {


   describe( "when the class is created", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      it( "should have a default imageSrc of empty string", function () {
         assertEqual( data.imageSrc, "" )
      } );

      it( "should have a default pageNumber of 1", function () {
         assertEqual( data.pageNumber, 1 )
      } );
   } );

   describe( "when pageNumber is set", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      list.add( "url1" );
      list.add( "url2" );
      list.add( "url3" );
      data.pageNumber = 2;

      it( "should set imageSrc to the correct zero-indexed url", function () {
         assertEqual( data.imageSrc, "url2" )
      } );

   } );

   describe( "when pageNumber is set at current value", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      list.add( "url1" );
      list.add( "url2" );
      list.add( "url3" );


      it( "should set imageURL if empty string", function () {
         data.pageNumber = 1;
         assertEqual( data.imageSrc, "url1" );
      } );


   } );


   describe( "when pageNumber is set out of bounds", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      list.add( "url1" );
      list.add( "url2" );
      list.add( "url3" );


      it( "should limit too high pageNumber to image length", function () {
         data.pageNumber = 4;
         assertEqual( data.pageNumber, 3 )
      } );

      it( "should limit too low pageNumber to 1", function () {
         data.pageNumber = 0;
         assertEqual( data.pageNumber, 1 )
      } );

   } );

   describe( "when reset is called", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      list.add( "url1" );
      list.add( "url2" );
      list.add( "url3" );
      data.pageNumber = 3;
      data.totalPages = 1;
      list.images = [];
      list.add( "url4" );
      data.reset();

      it( "should set pageNumber to 1", function () {
         assertEqual( data.pageNumber, 1 )
      } );

      it( "should set imageSrc to new values", function () {
         assertEqual( data.imageSrc, "url4" )
      } );


   } );

   describe( "when totalPages is called", function () {

      var list = new MockImageList();
      var data = new PageData( list );

      list.add( "url1" );
      list.add( "url2" );
      list.add( "url3" );
      list.add( "url4" );
      list.add( "url5" );

      it( "should return length of images", function () {
         assertEqual( data.totalPages, 5 );
      } );


   } );


} );
