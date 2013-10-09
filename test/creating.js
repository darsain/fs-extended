'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./helpers');

var isWin = !!process.platform.match(/^win/);
var notWin = !isWin;

describe('Creating files:', function () {
	var data = h.rndstr();
	var mode = '776';

	afterEach(function () {
		fs.emptyDirSync(h.tmp);
	});

	describe('.createFile()', function () {

		it('should create a file with a specified data and mode', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFile(filePath, data, { mode: mode }, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0666 when mode is omitted', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			var mode = '666';
			fs.createFile(filePath, data, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(mode);
				}
				done();
			});
		});

		it('should override file with new content', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data);

			var newData = h.rndstr();
			fs.createFile(filePath, newData, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(newData);
				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var filePath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createFile(filePath, '', function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				done();
			});
		});
	});

	describe('.createFileSync()', function () {

		it('should create a file with a specified data and mode', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data, { mode: mode });
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}
		});

		it('should default to 0666 when mode is omitted', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			var mode = '666';
			fs.createFileSync(filePath, data);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}
		});

		it('should override file with new content', function () {
			var filePath = path.join(h.tmp, h.rndstr());

			fs.createFileSync(filePath, data, { mode: mode });
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}

			var newData = h.rndstr();
			fs.createFileSync(filePath, newData);
			String(fs.readFileSync(filePath)).should.equal(newData);
		});

		it('should create missing parent directories', function () {
			var filePath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createFileSync(filePath, '');
			fs.existsSync(filePath).should.be.ok;
		});
	});

	describe('.ensureFile()', function () {

		it('should create missing file in existing directory', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.ensureFile(filePath, mode, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(mode);
				}
				done();
			});
		});

		it('should create missing file in missing directory', function (done) {
			var filePath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.ensureFile(filePath, mode, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.ok;
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0666 for new files when mode is omitted', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			var mode = '666';
			fs.ensureFile(filePath, function (err) {
				should.not.exist(err);
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(mode);
				}
				done();
			});
		});

		it('should not override existing file', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data);
			fs.ensureFile(filePath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				done();
			});
		});

		it('should change file mode, but not override existing file', function (done) {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data, { mode: mode });

			var newMode = '767';
			fs.ensureFile(filePath, newMode, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.equal(data);
				if (notWin) {
					h.modestr(fs.statSync(filePath).mode).should.equal(newMode);
				}
				done();
			});
		});
	});

	describe('.ensureFileSync()', function () {

		it('should create missing file in existing directory', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.ensureFileSync(filePath, mode);
			fs.existsSync(filePath).should.be.ok;
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}
		});

		it('should create missing file in missing directory', function () {
			var filePath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.ensureFileSync(filePath, mode);
			fs.existsSync(filePath).should.be.ok;
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}
		});

		it('should default to 0666 for new files when mode is omitted', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			var mode = '666';
			fs.ensureFileSync(filePath);
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(mode);
			}
		});

		it('should not override existing file', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data);
			fs.ensureFileSync(filePath);
			String(fs.readFileSync(filePath)).should.equal(data);
		});

		it('should change file mode, but not override existing file', function () {
			var filePath = path.join(h.tmp, h.rndstr());
			fs.createFileSync(filePath, data, { mode: mode });

			var newMode = '776';
			fs.ensureFileSync(filePath, newMode);
			String(fs.readFileSync(filePath)).should.equal(data);
			if (notWin) {
				h.modestr(fs.statSync(filePath).mode).should.equal(newMode);
			}
		});
	});

});

describe('Creating directories:', function () {
	var mode = '776';

	afterEach(function () {
		fs.emptyDirSync(h.tmp);
	});

	describe('.createDir()', function () {

		it('should create a directory with a specified mode', function (done) {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.createDir(dirPath, mode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					h.modestr(stat.mode).should.equal(mode);
				}
				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var dirPath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createDir(dirPath, mode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					h.modestr(stat.mode).should.equal(mode);
				}
				done();
			});
		});

		it('should default to 0777 when mode is omitted', function (done) {
			var dirPath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			var mode = '777';
			fs.createDir(dirPath, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					h.modestr(stat.mode).should.equal(mode);
				}
				done();
			});
		});

		it('should change mode when directory already exists but with a different mode than requested', function (done) {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);

			var newMode = '767';
			fs.createDir(dirPath, newMode, function (err) {
				should.not.exist(err);
				var stat = fs.statSync(dirPath);
				stat.isDirectory().should.be.ok;
				if (notWin) {
					h.modestr(stat.mode).should.equal(newMode);
				}
				done();
			});
		});

	});

	describe('.createDirSync()', function () {

		it('should create a directory with a specified mode', function () {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				h.modestr(stat.mode).should.equal(mode);
			}
		});

		it('should create missing parent directories', function () {
			var dirPath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.createDirSync(dirPath, mode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				h.modestr(stat.mode).should.equal(mode);
			}
		});

		it('should default to 0777 when mode is omitted', function () {
			var dirPath = path.join(h.tmp, h.rndstr(), h.rndstr(), h.rndstr());
			var mode = '777';
			fs.createDirSync(dirPath);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				h.modestr(stat.mode).should.equal(mode);
			}
		});

		it('should change mode when directory already exists but with a different mode than requested', function () {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.createDirSync(dirPath, mode);

			var newMode = '767';
			fs.createDirSync(dirPath, newMode);
			var stat = fs.statSync(dirPath);
			stat.isDirectory().should.be.ok;
			if (notWin) {
				h.modestr(stat.mode).should.equal(newMode);
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