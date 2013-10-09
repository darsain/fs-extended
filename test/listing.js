'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./helpers');

describe('Listing:', function () {
	var dirs = [
		'a',
		'b',
		'empty',
		path.join('a', 'a'),
		path.join('a', 'b'),
		path.join('a', 'b', 'a'),
		path.join('a', 'c'),
	];
	var files = [
		'1',
		'2',
		'3',
		path.join('a', '1'),
		path.join('a', '2'),
		path.join('b', '1'),
		path.join('b', '2'),
		path.join('b', '3'),
	];

	before(function () {
		fs.emptyDirSync(h.tmp);
		dirs.forEach(function (dir) {
			fs.createDirSync(path.join(h.tmp, dir));
		});
		files.forEach(function (file) {
			fs.createFileSync(path.join(h.tmp, file), h.rndstr(Math.round(Math.random()*100)));
		});
	});

	after(function () {
		fs.emptyDirSync(h.tmp);
	});

	describe('.listAll()', function () {

		it('should return an empty array when directory is empty', function (done) {
			fs.listAll(path.join(h.tmp, 'empty'), function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array).with.lengthOf(0);
				done();
			});
		});

		it('should list all items in a directory when no options are passed', function (done) {
			fs.listAll(h.tmp, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array).with.lengthOf(6);
				done();
			});
		});

		it('should list all items recursively when recursive option is enabled', function (done) {
			var options = {
				recursive: 1
			};
			fs.listAll(h.tmp, options, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array).with.lengthOf(dirs.length + files.length);
				dirs.forEach(function (dirPath) {
					items.indexOf(dirPath).should.not.equal(-1);
				});
				files.forEach(function (filePath) {
					items.indexOf(filePath).should.not.equal(-1);
				});
				done();
			});
		});

		it('should filter items with options.filter function', function (done) {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === '1';
			}
			var options = {
				filter: filter
			};
			fs.listAll(h.tmp, options, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array).with.lengthOf(1);
				done();
			});
		});

		it('should map list items with options.map function', function (done) {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isFile: stat.isFile(),
					isDirectory: stat.isDirectory(),
				};
			}
			var options = {
				map: map
			};
			fs.listAll(h.tmp, options, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array);
				items.forEach(function (item) {
					item.should.be.an.instanceOf(Object);
					item.should.have.property('path');
					item.should.have.property('isFile');
					item.should.have.property('isDirectory');
					item.path.should.be.a.String;
					item.isFile.should.be.a.Boolean;
					item.isDirectory.should.be.a.Boolean;
				});
				done();
			});
		});

		it('should map and sort items with a compare function', function (done) {
			function map(filePath, stat) {
				return {
					path: filePath,
					size: stat.size,
				};
			}
			function compare(a, b) {
				return a.size < b.size ? -1 : 1;
			}
			var options = {
				map: map,
				sort: compare,
			};
			fs.listAll(h.tmp, options, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array);
				var prevItemSize = -1;
				items.forEach(function (item) {
					(item.size >= prevItemSize).should.be.true;
					prevItemSize = item.size;
				});
				done();
			});
		});

		it('should prepend directory path to items when prependDir is enabled', function (done) {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			fs.listAll(h.tmp, options, function (err, items) {
				should.not.exist(err);
				items.should.be.an.instanceOf(Array).with.lengthOf(dirs.length + files.length);
				dirs.forEach(function (dirPath) {
					items.indexOf(path.join(h.tmp, dirPath)).should.not.equal(-1);
				});
				files.forEach(function (filePath) {
					items.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
				});
				done();
			});
		});

	});

	describe('.listAllSync()', function () {

		it('should return an empty array when directory is empty', function () {
			var items = fs.listAllSync(path.join(h.tmp, 'empty'));
			items.should.be.an.instanceOf(Array).with.lengthOf(0);
		});

		it('should list all items in a directory when no options are passed', function () {
			var items = fs.listAllSync(h.tmp);
			items.should.be.an.instanceOf(Array).with.lengthOf(6);
		});

		it('should list all items recursively when recursive option is enabled', function () {
			var options = {
				recursive: 1
			};
			var items = fs.listAllSync(h.tmp, options);
			items.should.be.an.instanceOf(Array).with.lengthOf(dirs.length + files.length);
			dirs.forEach(function (dirPath) {
				items.indexOf(dirPath).should.not.equal(-1);
			});
			files.forEach(function (filePath) {
				items.indexOf(filePath).should.not.equal(-1);
			});
		});

		it('should filter items with options.filter function', function () {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === '1';
			}
			var options = {
				filter: filter
			};
			var items = fs.listAllSync(h.tmp, options);
			items.should.be.an.instanceOf(Array).with.lengthOf(1);
		});

		it('should map list items with options.map function', function () {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isFile: stat.isFile(),
					isDirectory: stat.isDirectory(),
				};
			}
			var options = {
				map: map
			};
			var items = fs.listAllSync(h.tmp, options);
			items.should.be.an.instanceOf(Array);
			items.forEach(function (item) {
				item.should.be.an.instanceOf(Object);
				item.should.have.property('path');
				item.should.have.property('isFile');
				item.should.have.property('isDirectory');
				item.path.should.be.a.String;
				item.isFile.should.be.a.Boolean;
				item.isDirectory.should.be.a.Boolean;
			});
		});

		it('should map and sort items based on mapped data', function () {
			function map(filePath, stat) {
				return {
					path: filePath,
					size: stat.size,
				};
			}
			function compare(a, b) {
				return a.size < b.size ? -1 : 1;
			}
			var options = {
				map: map,
				sort: compare,
			};
			var items = fs.listAllSync(h.tmp, options);
			items.should.be.an.instanceOf(Array);
			var prevItemSize = -1;
			items.forEach(function (item) {
				(item.size >= prevItemSize).should.be.true;
				prevItemSize = item.size;
			});
		});

		it('should prepend directory path to items when prependDir is enabled', function () {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			var items = fs.listAllSync(h.tmp, options);
			items.should.be.an.instanceOf(Array).with.lengthOf(dirs.length + files.length);
			dirs.forEach(function (dirPath) {
				items.indexOf(path.join(h.tmp, dirPath)).should.not.equal(-1);
			});
			files.forEach(function (filePath) {
				items.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
			});
		});

	});

	describe('.listFiles()', function () {

		it('should return an empty array when directory is empty', function (done) {
			fs.listFiles(path.join(h.tmp, 'empty'), function (err, files) {
				should.not.exist(err);
				files.should.be.an.instanceOf(Array).with.lengthOf(0);
				done();
			});
		});

		it('should list all files in a directory when no options are passed', function (done) {
			fs.listFiles(h.tmp, function (err, files) {
				should.not.exist(err);
				files.should.be.an.instanceOf(Array).with.lengthOf(3);
				files.forEach(function (file) {
					fs.statSync(path.join(h.tmp, file)).isFile().should.be.true;
				});
				done();
			});
		});

		it('should list all files recursively when recursive option is enabled', function (done) {
			var options = {
				recursive: 1
			};
			fs.listFiles(h.tmp, options, function (err, fls) {
				should.not.exist(err);
				fls.should.be.an.instanceOf(Array).with.lengthOf(files.length);
				files.forEach(function (filePath) {
					fls.indexOf(filePath).should.not.equal(-1);
				});
				done();
			});
		});

		it('should filter files with options.filter function', function (done) {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === '1';
			}
			var options = {
				filter: filter
			};
			fs.listFiles(h.tmp, options, function (err, files) {
				should.not.exist(err);
				files.should.be.an.instanceOf(Array).with.lengthOf(1);
				fs.statSync(path.join(h.tmp, files[0])).isFile().should.be.true;
				done();
			});
		});

		it('should map list items with options.map function', function (done) {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isFile: stat.isFile(),
				};
			}
			var options = {
				map: map
			};
			fs.listFiles(h.tmp, options, function (err, files) {
				should.not.exist(err);
				files.should.be.an.instanceOf(Array);
				files.forEach(function (file) {
					file.should.be.an.instanceOf(Object);
					file.should.have.property('path');
					file.should.have.property('isFile');
					file.path.should.be.a.String;
					file.isFile.should.be.true;
				});
				done();
			});
		});

		it('should prepend directory path to files when prependDir is enabled', function (done) {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			fs.listFiles(h.tmp, options, function (err, fls) {
				should.not.exist(err);
				fls.should.be.an.instanceOf(Array).with.lengthOf(files.length);
				files.forEach(function (filePath) {
					fls.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
				});
				done();
			});
		});

	});

	describe('.listFilesSync()', function () {

		it('should return an empty array when directory is empty', function () {
			var fls = fs.listFilesSync(path.join(h.tmp, 'empty'));
			fls.should.be.an.instanceOf(Array).with.lengthOf(0);
		});

		it('should list all files in a directory when no options are passed', function () {
			var fls = fs.listFilesSync(h.tmp);
			fls.should.be.an.instanceOf(Array).with.lengthOf(3);
			files.forEach(function (file) {
				fs.statSync(path.join(h.tmp, file)).isFile().should.be.true;
			});
		});

		it('should list all files recursively when recursive option is enabled', function () {
			var options = {
				recursive: 1
			};
			var fls = fs.listFilesSync(h.tmp, options);
			fls.should.be.an.instanceOf(Array).with.lengthOf(files.length);
			files.forEach(function (filePath) {
				fls.indexOf(filePath).should.not.equal(-1);
			});
		});

		it('should filter files with options.filter function', function () {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === '1';
			}
			var options = {
				filter: filter
			};
			var fls = fs.listFilesSync(h.tmp, options);
			fls.should.be.an.instanceOf(Array).with.lengthOf(1);
			fs.statSync(path.join(h.tmp, fls[0])).isFile().should.be.true;
		});

		it('should map list items with options.map function', function () {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isFile: stat.isFile(),
				};
			}
			var options = {
				map: map
			};
			var files = fs.listFilesSync(h.tmp, options);
			files.should.be.an.instanceOf(Array);
			files.forEach(function (file) {
				file.should.be.an.instanceOf(Object);
				file.should.have.property('path');
				file.should.have.property('isFile');
				file.path.should.be.a.String;
				file.isFile.should.be.true;
			});
		});

		it('should prepend directory path to files when prependDir is enabled', function () {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			var fls = fs.listFilesSync(h.tmp, options);
			fls.should.be.an.instanceOf(Array).with.lengthOf(files.length);
			files.forEach(function (filePath) {
				fls.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
			});
		});

	});

	describe('.listDirs()', function () {

		it('should return an empty array when directory is empty', function (done) {
			fs.listDirs(path.join(h.tmp, 'empty'), function (err, dirs) {
				should.not.exist(err);
				dirs.should.be.an.instanceOf(Array).with.lengthOf(0);
				done();
			});
		});

		it('should list all directories in a directory when no options are passed', function (done) {
			fs.listDirs(h.tmp, function (err, dirs) {
				should.not.exist(err);
				dirs.should.be.an.instanceOf(Array).with.lengthOf(3);
				dirs.forEach(function (file) {
					fs.statSync(path.join(h.tmp, file)).isDirectory().should.be.true;
				});
				done();
			});
		});

		it('should list all directories recursively when recursive option is enabled', function (done) {
			var options = {
				recursive: 1
			};
			fs.listDirs(h.tmp, options, function (err, drs) {
				should.not.exist(err);
				drs.should.be.an.instanceOf(Array).with.lengthOf(dirs.length);
				dirs.forEach(function (filePath) {
					drs.indexOf(filePath).should.not.equal(-1);
				});
				done();
			});
		});

		it('should filter directories with options.filter function', function (done) {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === 'a';
			}
			var options = {
				filter: filter
			};
			fs.listDirs(h.tmp, options, function (err, dirs) {
				should.not.exist(err);
				dirs.should.be.an.instanceOf(Array).with.lengthOf(1);
				fs.statSync(path.join(h.tmp, dirs[0])).isDirectory().should.be.true;
				done();
			});
		});

		it('should map list items with options.map function', function (done) {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isDirectory: stat.isDirectory(),
				};
			}
			var options = {
				map: map
			};
			fs.listDirs(h.tmp, options, function (err, dirs) {
				should.not.exist(err);
				dirs.should.be.an.instanceOf(Array);
				dirs.forEach(function (dir) {
					dir.should.be.an.instanceOf(Object);
					dir.should.have.property('path');
					dir.should.have.property('isDirectory');
					dir.path.should.be.a.String;
					dir.isDirectory.should.be.true;
				});
				done();
			});
		});

		it('should prepend directory path to directories when prependDir is enabled', function (done) {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			fs.listDirs(h.tmp, options, function (err, drs) {
				should.not.exist(err);
				drs.should.be.an.instanceOf(Array).with.lengthOf(dirs.length);
				dirs.forEach(function (filePath) {
					drs.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
				});
				done();
			});
		});

	});

	describe('.listDirsSync()', function () {

		it('should return an empty array when directory is empty', function () {
			var drs = fs.listDirsSync(path.join(h.tmp, 'empty'));
			drs.should.be.an.instanceOf(Array).with.lengthOf(0);
		});

		it('should list all directories in a directory when no options are passed', function () {
			var drs = fs.listDirsSync(h.tmp);
			drs.should.be.an.instanceOf(Array).with.lengthOf(3);
			drs.forEach(function (file) {
				fs.statSync(path.join(h.tmp, file)).isDirectory().should.be.true;
			});
		});

		it('should list all directories recursively when recursive option is enabled', function () {
			var options = {
				recursive: 1
			};
			var drs = fs.listDirsSync(h.tmp, options);
			drs.should.be.an.instanceOf(Array).with.lengthOf(dirs.length);
			dirs.forEach(function (filePath) {
				drs.indexOf(filePath).should.not.equal(-1);
			});
		});

		it('should filter directories with options.filter function', function () {
			function filter(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return path.basename(filePath) === 'a';
			}
			var options = {
				filter: filter
			};
			var drs = fs.listDirsSync(h.tmp, options);
			drs.should.be.an.instanceOf(Array).with.lengthOf(1);
			fs.statSync(path.join(h.tmp, drs[0])).isDirectory().should.be.true;
		});

		it('should map list items with options.map function', function () {
			function map(filePath, stat) {
				fs.existsSync(filePath).should.be.true;
				stat.should.be.an.instanceOf(fs.Stats);
				return {
					path: filePath,
					isDirectory: stat.isDirectory(),
				};
			}
			var options = {
				map: map
			};
			var dirs = fs.listDirsSync(h.tmp, options);
			dirs.should.be.an.instanceOf(Array);
			dirs.forEach(function (dir) {
				dir.should.be.an.instanceOf(Object);
				dir.should.have.property('path');
				dir.should.have.property('isDirectory');
				dir.path.should.be.a.String;
				dir.isDirectory.should.be.true;
			});
		});

		it('should prepend directory path to directories when prependDir is enabled', function () {
			var options = {
				recursive: 1,
				prependDir: 1
			};
			var drs = fs.listDirsSync(h.tmp, options);
			drs.should.be.an.instanceOf(Array).with.lengthOf(dirs.length);
			dirs.forEach(function (filePath) {
				drs.indexOf(path.join(h.tmp, filePath)).should.not.equal(-1);
			});
		});

	});

});