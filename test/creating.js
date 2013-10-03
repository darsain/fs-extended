'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./lib/helpers');

var isWin = !!process.platform.match(/^win/);
var notWin = !isWin;
var tmp = 'tmp';

describe('Creating files:', function () {
	var data = h.rndstr();
	var mode = parseInt('0776', 8);

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.createFile()', function () {

		it('should create a file with a specified data and mode', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFile(filePath, data, mode, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0666 when mode is omitted', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			var mode = parseInt('0666', 8);
			fs.createFile(filePath, data, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(mode);
				}
				done();
			});
		});

		it('should override file with new content and mode', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data, mode);

			var newData = h.rndstr();
			var newMode = parseInt('0767', 8);
			fs.createFile(filePath, newData, newMode, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(newData);
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(newMode);
				}
				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var filePath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createFile(filePath, '', function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				done();
			});
		});
	});

	describe('.createFileSync()', function () {

		it('should create a file with a specified data and mode', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data, mode);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}
		});

		it('should default to 0666 when mode is omitted', function () {
			var filePath = path.join(tmp, h.rndstr());
			var mode = parseInt('0666', 8);
			fs.createFileSync(filePath, data);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}
		});

		it('should override file with new content and mode', function () {
			var filePath = path.join(tmp, h.rndstr());

			fs.createFileSync(filePath, data, mode);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}

			var newData = h.rndstr();
			var newMode = parseInt('0767', 8);
			fs.createFileSync(filePath, newData, newMode);
			String(fs.readFileSync(filePath)).should.equal(newData);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(newMode);
			}
		});

		it('should create missing parent directories', function () {
			var filePath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createFileSync(filePath, '');
			fs.existsSync(filePath).should.be.ok;
		});
	});

	describe('.ensureFile()', function () {

		it('should create missing file in existing directory', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.ensureFile(filePath, mode, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(mode);
				}
				done();
			});
		});

		it('should create missing file in missing directory', function (done) {
			var filePath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.ensureFile(filePath, mode, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0666 for new files when mode is omitted', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			var mode = parseInt('0666', 8);
			fs.ensureFile(filePath, function (err) {
				should.not.exist(err);
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(mode);
				}
				done();
			});
		});

		it('should not override existing file', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data);
			fs.ensureFile(filePath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				done();
			});
		});

		it('should change file mode, but not override existing file', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data, mode);

			var newMode = parseInt('0767', 8);
			fs.ensureFile(filePath, newMode, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					fs.statSync(filePath).mode.should.equal(newMode);
				}
				done();
			});
		});
	});

	describe('.ensureFileSync()', function () {

		it('should create missing file in existing directory', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.ensureFileSync(filePath, mode);
			fs.existsSync(filePath).should.be.ok;
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}
		});

		it('should create missing file in missing directory', function () {
			var filePath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.ensureFileSync(filePath, mode);
			fs.existsSync(filePath).should.be.ok;
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}
		});

		it('should default to 0666 for new files when mode is omitted', function () {
			var filePath = path.join(tmp, h.rndstr());
			var mode = parseInt('0666', 8);
			fs.ensureFileSync(filePath);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(mode);
			}
		});

		it('should not override existing file', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data);
			fs.ensureFile(filePath);
			String(fs.readFileSync(filePath)).should.equal(data);
		});

		it('should change file mode, but not override existing file', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.createFileSync(filePath, data, mode);

			var newMode = parseInt('0776', 8);
			fs.ensureFileSync(filePath, newMode);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				fs.statSync(filePath).mode.should.equal(newMode);
			}
		});
	});

});

describe('Creating directories:', function () {
	var mode = parseInt('0776', 8);

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.createDir()', function () {

		it('should create a directory with a specified mode', function (done) {
			var dirPath = path.join(tmp, h.rndstr());
			fs.createDir(dirPath, mode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					stat.mode.should.equal(mode);
				}
				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var dirPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createDir(dirPath, mode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					stat.mode.should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0777 when mode is omitted', function (done) {
			var dirPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			var mode = parseInt('0777', 8);
			fs.createDir(dirPath, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					stat.mode.should.equal(mode);
				}
				done();
			});
		});

		it('should change mode when directory already exists but with a different mode than requested', function (done) {
			var dirPath = path.join(tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);

			var newMode = parseInt('0767', 8);
			fs.createDir(dirPath, newMode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					stat.mode.should.equal(newMode);
				}
				done();
			});
		});

	});

	describe('.createDirSync()', function () {

		it('should create a directory with a specified mode', function () {
			var dirPath = path.join(tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				stat.mode.should.equal(mode);
			}
		});

		it('should create missing parent directories', function () {
			var dirPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createDirSync(dirPath, mode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				stat.mode.should.equal(mode);
			}
		});

		it('should default to 0777 when mode is omitted', function () {
			var dirPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			var mode = parseInt('0777', 8);
			fs.createDirSync(dirPath);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				stat.mode.should.equal(mode);
			}
		});

		it('should change mode when directory already exists but with a different mode than requested', function () {
			var dirPath = path.join(tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);

			var newMode = parseInt('0767', 8);
			fs.createDirSync(dirPath, newMode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				stat.mode.should.equal(newMode);
			}
		});

	});

	describe('.ensureDir()', function () {

		it('should be an alias of .createDir()', function () {
			fs.ensureDir.should.equal(fs.createDir);
		});

	});

	describe('.ensureDirSync()', function () {

		it('should be an alias of .createDirSync()', function () {
			fs.ensureDirSync.should.equal(fs.createDirSync);
		});

	});

});