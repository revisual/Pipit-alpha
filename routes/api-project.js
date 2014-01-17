exports.get = function ( req, res ) {

   var path = require( "path" );
   var buildFiles = require( "../scripts/utils/fs/file_access.js" );
   var filepath = path.join( __dirname, '../public' ) + '/json/projects.json';
   var data = buildFiles.getJSONFile( filepath );

   res.json( data );
}

