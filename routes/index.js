var router = require( 'express' ).Router()
   , api = require( './api' )
   , home = require( './home' );

router.get( '/', home.index );
router.get( '/app/', home.app );
router.get( '/api/projects/', api.project );
router.get( '/api/:project/:book/:size', api.book );
// app.post( '/api/upload/:name', api.upload, api.uploadSuccess, api.uploadError );

module.exports = router;