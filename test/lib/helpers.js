'use strict';

var STR_POOL = 'abcdefghijklmnopqrstuvwxyz';

module.exports = {
	/**
	 * Generate random string.
	 *
	 * @param  {Int} size
	 *
	 * @return {String}
	 */
	rndstr: function (size) {
		size = Math.abs(0|size || 20);
		var result = '';
		while (size--) {
			result += STR_POOL[Math.floor(Math.random()*STR_POOL.length)];
		}
		return result;
	}
};