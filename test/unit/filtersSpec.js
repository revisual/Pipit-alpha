'use strict';

/* jasmine specs for filters go here */

<<<<<<< HEAD
/*describe('filter', function() {
  beforeEach(module('wordMaster.filters'));
=======
xdescribe('filter', function() {
  beforeEach(module('app.filters'));
>>>>>>> origin/master


  describe('interpolate', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));


    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });
<<<<<<< HEAD
});*/
=======
});
>>>>>>> origin/master
