var api = require( './api' ) ,
   home = require( './home' );



module.exports = function ( app ) {

  /* app.get('/', function (req, res){
      res.writeHead(200, {'Content-Type': 'text/html' });
      *//* Display the file upload form. *//*
      var form = '<form action="/api/upload/good" enctype="multipart/form-data" method="post"><input name="title" type="text" /><input multiple="multiple" name="upload" type="file" /><input type="submit" value="Upload" /></form>';
      res.end(form);
   });*/

   app.get( '/', home.index );
   app.get( '/app/', home.app );
   app.get( '/api/projects/', api.project );
   app.get( '/api/:project/:book/:size', api.book );
  // app.post( '/api/upload/:name', api.upload, api.uploadSuccess, api.uploadError );
};