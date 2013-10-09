'use strict';

process.umask(0);

var fs = require('../index');
var h = require('./helpers');

before(function () {
	fs.createDirSync(h.tmp);
	fs.emptyDirSync(h.tmp);
});

after(function () {
	fs.deleteDirSync(h.tmp);
});