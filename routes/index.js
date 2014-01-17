exports.index = function ( req, res ) {

   var path = require( "path" );
   var buildFiles = require( "../scripts/utils/fs/file_access.js" );
   var filepath = path.join( __dirname, '../views/index.html' );
   var data = buildFiles.getFileUTF8( filepath );

   res.send( data);
};