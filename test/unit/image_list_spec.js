describe( "ImageList", function () {

   describe( "when the class is created", function () {
      it( "should have a default numberLoadedImages of 0", function () {
         var list = new ImageList();
         assert( list.numberLoadedImages === 0 )
      } );

      it( "should have a default totalNumberImages of 0", function () {
         var list = new ImageList();
         assert( list.totalNumberImages === 0 )
      } );
   } );

   describe( "when a url is added", function () {

      it( "pushes it to the urls property", function () {
         var url = "../public/images/test/01.jpg";
         var list = new ImageList();
         list.add( url );
         assert( list.files[0] === url )
      } );

      it( "increases totalNumberImages property by 1", function () {
         var url = "../public/images/test/01.jpg";
         var list = new ImageList();
         list.add( url );
         assert( list.totalNumberImages === 1 )
      } );
   } );

   describe( "when an array of urls is added", function () {
      it( "concats it to the urls property", function () {
         var url = ["../public/images/test/01.jpg", "../public/images/test/02.jpg"];
         var list = new ImageList();
         list.add( "../public/images/test/03.jpg" );
         list.add( url );
         assert( list.files.length === 3 )
      } );

      it( "increases totalNumberImages property by number added", function () {
         var url = ["../public/images/test/01.jpg", "../public/images/test/02.jpg"];
         var list = new ImageList();
         list.add( "../public/images/test/03.jpg" );
         list.add( url );
         assert( list.totalNumberImages === 3 )
      } );
   } );


   describe( "when start is called on a single url", function () {

      var url = "../public/images/test/01.jpg";
      var list = new ImageList();
      var completed = false;
      var progressed = false;
      var numberLoadedImages = 0;
      var totalNumberImages = 0;

      list.add( url );

      list.onProgress = function ( numberLoaded, totalNumber ) {
         progressed = true;
         numberLoadedImages = numberLoaded;
         totalNumberImages = totalNumber;
      };

      list.onComplete = function () {
         completed = true;
      } ;

      list.start();


      it( "pushes a new Image onto the images property", function () {
         assert( list.images[0] instanceof Image );
      } )

      it( "creates only one Image", function () {
         assert( list.images.length === 1 );
      } )

      it( "sets the Image src to the url", function () {
         assert( list.images[0].outerHTML === "<img src=\"" + url + "\">" );
      } )

      it( "dispatches the onProgress event when the Image onLoad is called", function () {
         assert( progressed );
      } );

      it( "passes the numberLoadedImages and totalNumberImages values in onProgress", function () {
         assert( numberLoadedImages === 1 );
         assert( totalNumberImages === 1 );
      } );

      it( "dispatches the onComplete event when the Image onLoad is called", function () {
         assert( completed );
      } );
   } );


   describe( "when start is called on multiple urls", function () {

      var url = ["../public/images/test/01.jpg", "../public/images/test/02.jpg", "../public/images/test/03.jpg"];
      var list = new ImageList();
      var completed = 0;
      var progressed = 0;
      var numberLoadedImages = [];
      var totalNumberImages = [];

      list.add( url );

      list.onProgress =  function ( numberLoaded, totalNumber ) {
         progressed += 1;
         numberLoadedImages.push( numberLoaded );
         totalNumberImages.push( totalNumber );
      } ;

      list.onComplete =  function () {
         completed += 1;
      } ;

      list.start();


      it( "dispatches the onProgress event three times", function () {
         assert( progressed === 3 );
      } );

      it( "passes the numberLoadedImages values in onProgress", function () {
         assert( numberLoadedImages[0] === 1 );
         assert( numberLoadedImages[1] === 2 );
         assert( numberLoadedImages[2] === 3 );
      } );

      it( "passes the totalNumberImages values in onProgress", function () {
         assert( totalNumberImages[0] === 3 );
         assert( totalNumberImages[1] === 3 );
         assert( totalNumberImages[2] === 3 );
      } );

      it( "dispatches the onComplete event once", function () {
         assert( completed === 1 );
      } );

      it( "logs no errors in the error list", function () {
         assertEqual( list.errors.length , 0 );
      } );

      it( "contains the correct files list", function () {
         assertEqual( list.files[0] , url[0] );
         assertEqual( list.files[1] , url[1] );
         assertEqual( list.files[2] , url[2] );
      } );
   } );


   describe( "when an load error occurs", function () {

      var url = ["../public/images/test/01.jpg", "../public/images/test/nonexistant.jpg", "../public/images/test/03.jpg"];
      var list = new ImageList();
      var completed = 0;
      var progressed = 0;
      var numberLoadedImages = [];
      var totalNumberImages = [];

      list.add( url );

      list.onProgress =  function ( numberLoaded, totalNumber ) {
         progressed += 1;
         numberLoadedImages.push( numberLoaded );
         totalNumberImages.push( totalNumber );
      } ;

      list.onComplete = function () {
         completed += 1;
      } ;

      list.start();

      it( "adds the error to the error property", function () {
         assert( list.errors.length === 1 );
      } );

      it( "dispatches the onProgress event three times", function () {
         assert( progressed === 3 );
      } );

      it( "passes the numberLoadedImages values in onProgress", function () {
         assert( numberLoadedImages[0] === 1 );
         assert( numberLoadedImages[1] === 2 );
         assert( numberLoadedImages[2] === 3 );
      } );

      it( "passes the totalNumberImages values in onProgress", function () {
         assert( totalNumberImages[0] === 3 );
         assert( totalNumberImages[1] === 3 );
         assert( totalNumberImages[2] === 3 );
      } );

      it( "dispatches the onComplete event once", function () {
         assert( completed === 1 );
      } );
   } );

   describe( "when reset is called after a load is completed", function () {

      var url = ["../public/images/test/01.jpg", "../public/images/test/nonexistant.jpg", "../public/images/test/03.jpg"];
      var list = new ImageList();
      var completed = 0;
      var progressed = 0;
      var numberLoadedImages = [];
      var totalNumberImages = [];

      list.add( url );

      list.onProgress =  function ( numberLoaded, totalNumber ) {
         progressed += 1;
         numberLoadedImages.push( numberLoaded );
         totalNumberImages.push( totalNumber );
      } ;

      list.onComplete = function () {
         completed += 1;
         list.reset();
      } ;

      list.start();

      it( "resets the error list", function () {
         assertEqual( list.errors.length , 0 );
      } );

      it( "resets the image list", function () {
         assertEqual( list.images.length , 0 );
      } );

      it( "resets the files list", function () {
         assertEqual( list.files.length , 0 );
      } );


   } );

   describe( "when resetWith is called after a load is completed", function () {

      var url = ["../public/images/test/01.jpg", "../public/images/test/nonexistant.jpg", "../public/images/test/03.jpg"];
      var url2 = ["../public/images/test/04.jpg", "../public/images/test/nonexistant.jpg", "../public/images/test/05.jpg"];
      var list = new ImageList();
      var completed = 0;
      var progressed = 0;
      var numberLoadedImages = [];
      var totalNumberImages = [];

      list.add( url );

      list.onProgress =  function ( numberLoaded, totalNumber ) {
         progressed += 1;
         numberLoadedImages.push( numberLoaded );
         totalNumberImages.push( totalNumber );
      } ;

      list.onComplete = function () {
         completed += 1;
         list.resetWith(url2);
      } ;

      list.start();

      it( "resets the error list", function () {
         assertEqual( list.errors.length , 0 );
      } );

      it( "resets the image list", function () {
         assertEqual( list.images.length , 0 );
      } );

      it( "resets the files list", function () {
         assertEqual( list.files.length , 3 );
      } );

      it( "contains the correct files list", function () {
         assertEqual( list.files[0] , url2[0] );
         assertEqual( list.files[1] , url2[1] );
         assertEqual( list.files[2] , url2[2] );
      } );


   } );

   describe( "when reset is called during loading", function () {

      var url = ["../public/images/test/01.jpg", "../public/images/test/02.jpg", "../public/images/test/03.jpg"];
      var list = new ImageList();
      var completed = 0;
      var progressed = 0;
      var numberLoadedImages = [];
      var totalNumberImages = [];

      list.add( url );

      list.onProgress =  function ( numberLoaded, totalNumber ) {
         progressed += 1;
         numberLoadedImages.push( numberLoaded );
         totalNumberImages.push( totalNumber );
         list.reset()
      } ;

      list.onComplete = function () {
         completed += 1;
      } ;

      list.start();

      it( "dispatches the onProgress event once", function () {
         assertEqual( progressed, 1 );
      } );

      it( "passes the numberLoadedImages values in onProgress", function () {
         assertEqual( numberLoadedImages[0] , 1 );
      } );

      it( "passes the totalNumberImages values in onProgress", function () {
         assertEqual( totalNumberImages[0] , 3 );
      } );

      it( "dispatches the onComplete event once", function () {
         assertEqual( completed , 1 );
      } );

      it( "resets the error list", function () {
         assertEqual( list.errors.length , 0 );
      } );

      it( "resets the image list", function () {
         assertEqual( list.images.length , 0 );
      } );

      it( "resets the files list", function () {
         assertEqual( list.files.length , 0 );
      } );




   } );


} );
