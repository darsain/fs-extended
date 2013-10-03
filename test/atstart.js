'use strict';

var fs = require('../index');

var tmp = 'tmp';

before(function () {
	fs.createDirSync(tmp);
	fs.emptyDirSync(tmp);
});

after(function () {
	fs.deleteDirSync(tmp);
});