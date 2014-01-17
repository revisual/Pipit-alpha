describe( 'TickProvider', function () {

   describe( "when the class is created with no params", function () {

      var tick = new TickProvider();

      it( "should have a default timeInterval of 0", function () {
         assertEqual( tick.timeInterval, 0 )
      } );

      it( "should have a default repeatCount of 0", function () {
         assertEqual( tick.repeatCount, 0 )
      } );
   } );

   describe( "when the class is created with params", function () {

      var tick = new TickProvider( 1, 20 );

      it( "should have the timeInterval passed in constructor", function () {
         assertEqual( tick.timeInterval, 1 )
      } );

      it( "should have the repeatCount passed in constructor", function () {
         assertEqual( tick.repeatCount, 20 )
      } );
   } );


   describe( "when start is called", function () {
      var interval = 5;
      var repeatCount = 50;
      var o = configure( interval, repeatCount );

      it( 'should tick with the interval passed in constructor', function () {
         this.timeout( 600 );

         o.tick.completed.addOnce( function () {
            var accuracy = 1;
            var mean = calculateMean( o.expectedTimes );
            assertPlusOrMinus( mean, interval, accuracy );
         } )
      } );

      it( 'should tick with the repeat passed in constructor', function () {
         this.timeout( 600 );
         o.tick.completed.addOnce( function () {
            assertEqual( repeatCount, o.expectedTimes.length );
         } )
      } );

      it( 'should pass actual time passed since last tick as argument in tick handler', function ( done ) {
         this.timeout( 600 );
         o.tick.completed.addOnce( function () {
            var len = o.expectedTimes.length
            for (var i = 0; i < len; i++) {
               assertPlusOrMinus( o.receivedTimes[i], o.expectedTimes[i], 1 );
            }

            done();
         } )
      } );

      function configure( interval, repeatCount ) {

         var startTime = 0;
         var expectedTimes = [];
         var recievedTimes = [];

         var tick = new TickProvider( interval, repeatCount );

         tick.ticked.add( function ( time ) {
            var now = new Date().getTime();
            expectedTimes.push( now - startTime );
            recievedTimes.push( time );
            startTime = now;
         } )

         startTime = new Date().getTime();
         tick.start();
         return { tick: tick, startTime: startTime, receivedTimes: recievedTimes, expectedTimes: expectedTimes};
      }
   } );

   describe( "when repeatCount is changed", function () {

      it( 'should stop if set less than current count', function ( done ) {
         this.timeout( 500 );
         var o = configure( 10, 5, 1 )
         o.tick.completed.add( function () {
            assertEqual( o.count, 3 );
            done();
         } );

      } );

      it( 'should continue to new repeatCount if set greater than current count', function ( done ) {
         this.timeout( 2000 );

         var finalCount = 10;
         var o = configure( 10, 5, finalCount )

         o.tick.completed.add( function () {
            assertEqual( finalCount, o.count )
            done();
         } );

      } );

      function configure( interval, repeatCount, changedRepeatCount ) {
         var tick = new TickProvider( interval, repeatCount );
         var o = { tick: tick, count: 0}
         tick.ticked.add( function ( time ) {
            o.count = tick.count;
            if (tick.count == 3) {
               tick.repeatCount = changedRepeatCount;
            }

         } );
         tick.start();
         return o;
      }

   } );

   describe( "when repeatCount is zero", function () {
      it( 'should tick continuously until stop is called', function ( done ) {
         this.timeout( 1000 );
         var interval = 1;
         var tickCount = 0;
         var repeatCount = getRandomInt( 50, 100 );
         var tick = new TickProvider( interval, 0 );

         tick.ticked.add( function () {
            tickCount++;
            if (tickCount >= repeatCount) {
               tick.stop();
            }
         } );

         tick.completed.add( function () {
            done();
         } );

         tick.start();
      } );
   } );

   describe( "when stop is called", function () {


      var interval = 1;
      var count = 0;
      var totalCount = 3;
      var tick = new TickProvider( interval, 10 );

      tick.ticked.add( function () {
         count++;
         if (tick.count === totalCount) {
            tick.stop();
         }

      } );



      tick.start();

      it( 'should stop immediately', function (  ) {
         tick.completed.add( function () {
            assertEqual( count, totalCount );
         } );
      } );

      it( 'should reset the count property', function ( done ) {

            assertEqual( tick.count, 0 );
            done();

      } );
   } );


   function calculateMean( times ) {
      var total = 0;
      var len = times.length;
      for (var i = 0; i < len; i++) {
         var t = times[i];
         total += t;
      }

      var mean = Math.round( total / len );
      return mean;
   }



   function getRandomInt( min, max ) {
      return Math.floor( Math.random() * (max - min + 1) ) + min;
   }

} )
;


