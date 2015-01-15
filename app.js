/**
 * Module dependencies.
 */

var express = require( 'express' )
   , bodyParser = require( 'body-parser' )
   , favicon = require( 'serve-favicon' )
   , logger = require( 'morgan' )
   , http = require( 'http' )
   , path = require( 'path' )
   , routes = require( './routes' );

var PUBLIC_PATH = path.join( __dirname, 'public/' );
var app = express();

// all environments
app.set( 'port', process.env.PORT || 3000 );

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use( logger( 'dev' ) );
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json() );
/*app.use( express.methodOverride() );*/
app.use( express.static( PUBLIC_PATH ) );
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});





http.createServer( app ).listen( app.get( 'port' ), function () {
   console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );

