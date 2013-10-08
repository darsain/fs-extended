'use strict';

var os = require('os');
var path = require('path');

var STR_POOL = 'abcdefghijklmnopqrstuvwxyz';

module.exports = {
	/**
	 * Path to a temporary directory.
	 *
	 * @type {String}
	 */
	tmp: path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'fs-extended-test'),

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
	},

	/**
	 * Parse fs.Stats.mode format into a 3 character octal string.
	 *
	 * 16895 => '777'
	 *
	 * @param  {Int} mode
	 *
	 * @return {String}
	 */
	modestr: function (mode) {
		return (0 | mode & 511).toString(8);
	}
};