'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./lib/helpers');

var isWin = !!process.platform.match(/^win/);
var notWin = !isWin;
var tmp = 'tmp';

describe('Copying files:', function () {

	function createDummy() {
		var filePath = path.join(tmp, h.rndstr());
		var data = h.rndstr();
		var mode = parseInt('0776', 8);
		fs.createFileSync(filePath, data, mode);
		return {
			path: filePath,
			data: data,
			mode: mode
		};
	}

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.copyFile()', function () {

		it('should copy file to a new location, preserving its content and mode', function (done) {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copyFile(dummy.path, newPath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
				if (notWin) {
					fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
				}
				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.copyFile(dummy.path, newPath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
				if (notWin) {
					fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
				}
				done();
			});
		});

		it('should copy a file between different partitions/filesystems');

	});

	describe('.copyFileSync()', function () {

		it('should copy file to a new location, preserving its content and mode', function () {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copyFileSync(dummy.path, newPath);
			String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
			if (notWin) {
				fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
			}
		});

		it('should create missing parent directories', function () {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.copyFileSync(dummy.path, newPath);
			String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
			if (notWin) {
				fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
			}
		});

		it('should copy a file between different partitions/filesystems');

	});

	describe('.copy()', function () {

		it('should copy a file when path to a file is passed', function (done) {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copy(dummy.path, newPath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
				if (notWin) {
					fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
				}
				done();
			});
		});

	});

	describe('.copySync()', function () {

		it('should copy a file when path to a file is passed', function () {
			var dummy = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copySync(dummy.path, newPath);
			String(fs.readFileSync(dummy.path)).should.equal(String(fs.readFileSync(newPath)));
			if (notWin) {
				fs.statSync(dummy.path).mode.should.equal(fs.statSync(newPath).mode);
			}
		});

	});

});

describe('Copying directories:', function () {
	var dirs = [
		'foo',
		'bar',
		'baz',
		path.join('baz', 'foo'),
		path.join('baz', 'bar', 'foo'),
	];
	var files = [
		path.join('bar', h.rndstr()),
		path.join('bar', h.rndstr()),
		path.join('baz', 'bar', h.rndstr()),
		h.rndstr(),
		h.rndstr(),
	];
	var modes = [
		parseInt('0777', 8),
		parseInt('0776', 8),
		parseInt('0767', 8),
		parseInt('0677', 8),
		parseInt('0666', 8),
	];

	function createDummy() {
		var dirPath = path.join(tmp, h.rndstr());
		dirs.forEach(function (dir) {
			fs.createDirSync(path.join(dirPath, dir), modes[Math.floor(Math.random()*modes.length)]);
		});
		files.forEach(function (file) {
			fs.createFileSync(path.join(dirPath, file), h.rndstr(), modes[Math.floor(Math.random()*modes.length)]);
		});
		return dirPath;
	}

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.copyDir()', function () {

		it('should copy directory and everything in it from one location to another', function (done) {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copyDir(dirPath, newPath, function (err) {
				should.not.exist(err);

				// Check directories
				dirs.forEach(function (dir) {
					var oldDirPath = path.join(dirPath, dir);
					var newDirPath = path.join(newPath, dir);
					var oldStat = fs.statSync(oldDirPath);
					var newStat = fs.statSync(newDirPath);
					newStat.isDirectory().should.be.ok;
					if (notWin) {
						oldStat.mode.should.equal(newStat.mode);
					}
				});

				// Check files
				files.forEach(function (file) {
					var oldFilePath = path.join(dirPath, file);
					var newFilePath = path.join(newPath, file);
					var oldStat = fs.statSync(oldFilePath);
					var newStat = fs.statSync(newFilePath);
					var oldData = String(fs.readFileSync(oldFilePath));
					var newData = String(fs.readFileSync(newFilePath));
					newStat.isFile().should.be.ok;
					oldStat.mode.should.equal(newStat.mode);
					if (notWin) {
						oldData.should.equal(newData);
					}
				});

				done();
			});
		});

		it('should create missing parent directories', function (done) {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.copyDir(dirPath, newPath, function (err) {
				should.not.exist(err);

				// Check directories
				dirs.forEach(function (dir) {
					var oldDirPath = path.join(dirPath, dir);
					var newDirPath = path.join(newPath, dir);
					var oldStat = fs.statSync(oldDirPath);
					var newStat = fs.statSync(newDirPath);
					newStat.isDirectory().should.be.ok;
					if (notWin) {
						oldStat.mode.should.equal(newStat.mode);
					}
				});

				// Check files
				files.forEach(function (file) {
					var oldFilePath = path.join(dirPath, file);
					var newFilePath = path.join(newPath, file);
					var oldStat = fs.statSync(oldFilePath);
					var newStat = fs.statSync(newFilePath);
					var oldData = String(fs.readFileSync(oldFilePath));
					var newData = String(fs.readFileSync(newFilePath));
					newStat.isFile().should.be.ok;
					oldData.should.equal(newData);
					if (notWin) {
						oldStat.mode.should.equal(newStat.mode);
					}
				});

				done();
			});
		});

		it('should copy a directory between partitions/filesystems');

	});

	describe('.copyDirSync()', function () {

		it('should copy directory and everything in it from one location to another', function () {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copyDirSync(dirPath, newPath);

			// Check directories
			dirs.forEach(function (dir) {
				var oldDirPath = path.join(dirPath, dir);
				var newDirPath = path.join(newPath, dir);
				var oldStat = fs.statSync(oldDirPath);
				var newStat = fs.statSync(newDirPath);
				newStat.isDirectory().should.be.ok;
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});

			// Check files
			files.forEach(function (file) {
				var oldFilePath = path.join(dirPath, file);
				var newFilePath = path.join(newPath, file);
				var oldStat = fs.statSync(oldFilePath);
				var newStat = fs.statSync(newFilePath);
				var oldData = String(fs.readFileSync(oldFilePath));
				var newData = String(fs.readFileSync(newFilePath));
				newStat.isFile().should.be.ok;
				oldData.should.equal(newData);
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});
		});

		it('should create missing parent directories', function () {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr(), h.rndstr(), h.rndstr());
			fs.copyDirSync(dirPath, newPath);

			// Check directories
			dirs.forEach(function (dir) {
				var oldDirPath = path.join(dirPath, dir);
				var newDirPath = path.join(newPath, dir);
				var oldStat = fs.statSync(oldDirPath);
				var newStat = fs.statSync(newDirPath);
				newStat.isDirectory().should.be.ok;
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});

			// Check files
			files.forEach(function (file) {
				var oldFilePath = path.join(dirPath, file);
				var newFilePath = path.join(newPath, file);
				var oldStat = fs.statSync(oldFilePath);
				var newStat = fs.statSync(newFilePath);
				var oldData = String(fs.readFileSync(oldFilePath));
				var newData = String(fs.readFileSync(newFilePath));
				newStat.isFile().should.be.ok;
				oldData.should.equal(newData);
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});
		});

		it('should copy a directory between partitions/filesystems');

	});

	describe('.copy()', function () {

		it('should copy a directory when path to a directory is passed', function (done) {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copy(dirPath, newPath, function (err) {
				should.not.exist(err);

				// Check directories
				dirs.forEach(function (dir) {
					var oldDirPath = path.join(dirPath, dir);
					var newDirPath = path.join(newPath, dir);
					var oldStat = fs.statSync(oldDirPath);
					var newStat = fs.statSync(newDirPath);
					newStat.isDirectory().should.be.ok;
					if (notWin) {
						oldStat.mode.should.equal(newStat.mode);
					}
				});

				// Check files
				files.forEach(function (file) {
					var oldFilePath = path.join(dirPath, file);
					var newFilePath = path.join(newPath, file);
					var oldStat = fs.statSync(oldFilePath);
					var newStat = fs.statSync(newFilePath);
					var oldData = String(fs.readFileSync(oldFilePath));
					var newData = String(fs.readFileSync(newFilePath));
					newStat.isFile().should.be.ok;
					oldData.should.equal(newData);
					if (notWin) {
						oldStat.mode.should.equal(newStat.mode);
					}
				});

				done();
			});
		});

	});

	describe('.copySync()', function () {

		it('should copy a directory when path to a directory is passed', function () {
			var dirPath = createDummy();
			var newPath = path.join(tmp, h.rndstr());
			fs.copyDirSync(dirPath, newPath);

			// Check directories
			dirs.forEach(function (dir) {
				var oldDirPath = path.join(dirPath, dir);
				var newDirPath = path.join(newPath, dir);
				var oldStat = fs.statSync(oldDirPath);
				var newStat = fs.statSync(newDirPath);
				newStat.isDirectory().should.be.ok;
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});

			// Check files
			files.forEach(function (file) {
				var oldFilePath = path.join(dirPath, file);
				var newFilePath = path.join(newPath, file);
				var oldStat = fs.statSync(oldFilePath);
				var newStat = fs.statSync(newFilePath);
				var oldData = String(fs.readFileSync(oldFilePath));
				var newData = String(fs.readFileSync(newFilePath));
				newStat.isFile().should.be.ok;
				oldData.should.equal(newData);
				if (notWin) {
					oldStat.mode.should.equal(newStat.mode);
				}
			});
		});

	});

});