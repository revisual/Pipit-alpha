/**
 * Created by Pip on 03/10/2014.
 */

var home = {
   index: function ( req, res ) {

      var path = require( "path" );
      var buildFiles = require( "../scripts/utils/fs/file_access.js" );
      var filepath = path.join( __dirname, '../views/index.html' );
      var data = buildFiles.getFileUTF8( filepath );

      res.send( data );
   },

   app: function ( req, res ) {

      var path = require( "path" );
      var buildFiles = require( "../scripts/utils/fs/file_access.js" );
      var filepath = path.join( __dirname, '../views/app.html' );
      var data = buildFiles.getFileUTF8( filepath );

      res.send( data );
   }
}

module.exports = home;
