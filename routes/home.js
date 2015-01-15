/**
 * Created by Pip on 03/10/2014.
 */



var home = {
   index: function ( req, res ) {

      var path = require( "path" );
      var files = require( "../scripts/utils/fs/file_access.js" );
      var JASONPath = path.join( __dirname, '../public' ) + '/json/';

      var data = files.getAllJSONIn( JASONPath );
      data.sort( function ( a, b ) {
         a = parseInt( a.index );
         b = parseInt( b.index );
         if (a > b)    return 1;
         if (a < b)return -1;
         return 0;
      });

      res.render( "index", {data: data,url: process.env.IMAGE_END_POINT} );
   },

   app: function ( req, res ) {

      var path = require( "path" );
      var buildFiles = require( "../scripts/utils/fs/file_access.js" );
      var filepath = path.join( __dirname, '../views/app.html' );
      var data = buildFiles.getFileUTF8( filepath );

      res.send( data );
   }
};

module.exports = home;
