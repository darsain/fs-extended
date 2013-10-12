'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./helpers');

describe('Walking filesystem:', function () {

	function create(files, dirs) {
		(dirs || []).forEach(function (dir) {
			fs.createDirSync(path.join(h.tmp, dir));
		});
		(files || []).forEach(function (file) {
			fs.createFileSync(path.join(h.tmp, file), '');
		});
	}

	before(function () {
		fs.emptyDirSync(h.tmp);
	});

	afterEach(function () {
		fs.emptyDirSync(h.tmp);
	});

	describe('.walkAll()', function () {

		it('should walk through all files and directories', function (done) {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			var total = files.length + dirs.length;
			var i = 0;
			create(files, dirs);
			fs.walkAll(h.tmp, function (err, item) {
				should.not.exist(err);
				if (fs.statSync(path.join(h.tmp, item)).isFile()) {
					files.should.include(item);
					files.splice(files.indexOf(item), 1);
				} else {
					dirs.should.include(item);
					dirs.splice(dirs.indexOf(item), 1);
				}
				if (++i >= total) {
					files.should.be.empty;
					dirs.should.be.empty;
					done();
				}
			});
		});

		it('should walk through all files and directories recursively', function (done) {
			var files = ['1', '2', '3', '4', path.join('a', '1'), path.join('a', '2'), path.join('a', '3'), path.join('a', '4')];
			var dirs = ['a', 'b', 'c', 'd', path.join('a', 'a'), path.join('a', 'b'), path.join('a', 'c'), path.join('a', 'd')];
			var total = files.length + dirs.length;
			var i = 0;
			create(files, dirs);
			fs.walkAll(h.tmp, { recursive: 1 }, function (err, item) {
				should.not.exist(err);
				if (fs.statSync(path.join(h.tmp, item)).isFile()) {
					files.should.include(item);
					files.splice(files.indexOf(item), 1);
				} else {
					dirs.should.include(item);
					dirs.splice(dirs.indexOf(item), 1);
				}
				if (++i >= total) {
					files.should.be.empty;
					dirs.should.be.empty;
					done();
				}
			});
		});

		it('should call next step when previous is done', function (done) {
			var files = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
			var total = files.length;
			var i = 0;
			create(files);
			var start = process.hrtime();
			fs.walkAll(h.tmp, function (err, item, next) {
				should.not.exist(err);
				files.length.should.be.above(0);
				files.should.include(item);
				files.splice(files.indexOf(item), 1);
				if (++i === total) {
					files.should.be.empty;
					process.hrtime(start)[1].should.be.above(total * 1000000);
					done();
				}
				setTimeout(next, 1);
			});
		});

		it('should abort when abort() function is called', function (done) {
			create(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
			var i = 0;
			fs.walkAll(h.tmp, function (err, item, next, abort) {
				should.not.exist(err);
				if (++i === 4) {
					abort();
					process.nextTick(check);
				}
				next();
			});

			function check() {
				i.should.equal(4);
				done();
			}
		});

		it('should thread walking when threads are requested', function (done) {
			var files = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
			var total = files.length;
			var i = 0;
			create(files);
			var start = process.hrtime();
			fs.walkAll(h.tmp, { threads: 10 }, function (err, item, next) {
				should.not.exist(err);
				if (++i === total) {
					process.hrtime(start)[1].should.be.below(total * 1000000);
					done();
				}
				setTimeout(next, 1);
			});
		});

	});

	describe('.walkAllSync()', function () {

		it('should walk through all files and directories', function () {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			create(files, dirs);
			fs.walkAllSync(h.tmp, function (item) {
				if (fs.statSync(path.join(h.tmp, item)).isFile()) {
					files.should.include(item);
					files.splice(files.indexOf(item), 1);
				} else {
					dirs.should.include(item);
					dirs.splice(dirs.indexOf(item), 1);
				}
			});
			files.should.be.empty;
			dirs.should.be.empty;
		});

		it('should walk through all files and directories recursively', function () {
			var files = ['1', '2', '3', '4', path.join('a', '1'), path.join('a', '2'), path.join('a', '3'), path.join('a', '4')];
			var dirs = ['a', 'b', 'c', 'd', path.join('a', 'a'), path.join('a', 'b'), path.join('a', 'c'), path.join('a', 'd')];
			create(files, dirs);
			fs.walkAllSync(h.tmp, { recursive: 1 }, function (item) {
				if (fs.statSync(path.join(h.tmp, item)).isFile()) {
					files.should.include(item);
					files.splice(files.indexOf(item), 1);
				} else {
					dirs.should.include(item);
					dirs.splice(dirs.indexOf(item), 1);
				}
			});
			files.should.be.empty;
			dirs.should.be.empty;
		});

		it('should abort when abort() function is called', function () {
			create(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
			var i = 0;
			fs.walkAllSync(h.tmp, function (item, abort) {
				if (++i === 4) {
					abort();
				}
			});
			i.should.equal(4);
		});

	});

	describe('.walkFiles()', function () {

		it('should walk through files only', function (done) {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			var total = files.length;
			var i = 0;
			create(files, dirs);
			fs.walkFiles(h.tmp, function (err, item) {
				should.not.exist(err);
				i.should.be.below(total);
				fs.statSync(path.join(h.tmp, item)).isFile().should.be.true;
				files.should.include(item);
				files.splice(files.indexOf(item), 1);
				if (++i >= total) {
					files.should.be.empty;
					done();
				}
			});
		});

	});

	describe('.walkFilesSync()', function () {

		it('should walk through files only', function () {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			var total = files.length;
			var i = 0;
			create(files, dirs);
			fs.walkFilesSync(h.tmp, function (item) {
				fs.statSync(path.join(h.tmp, item)).isFile().should.be.true;
				files.should.include(item);
				files.splice(files.indexOf(item), 1);
				i++;
			});
			i.should.equal(total);
			files.should.be.empty;
		});

	});

	describe('.walkDirs()', function () {

		it('should walk through directories only', function (done) {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			var total = dirs.length;
			var i = 0;
			create(files, dirs);
			fs.walkDirs(h.tmp, function (err, item) {
				should.not.exist(err);
				i.should.be.below(total);
				fs.statSync(path.join(h.tmp, item)).isDirectory().should.be.true;
				dirs.should.include(item);
				dirs.splice(dirs.indexOf(item), 1);
				if (++i >= total) {
					dirs.should.be.empty;
					done();
				}
			});
		});

	});

	describe('.walkDirsSync()', function () {

		it('should walk through directories only', function () {
			var files = ['1', '2', '3', '4'];
			var dirs = ['a', 'b', 'c', 'd'];
			var total = dirs.length;
			var i = 0;
			create(files, dirs);
			fs.walkDirsSync(h.tmp, function (item) {
				fs.statSync(path.join(h.tmp, item)).isDirectory().should.be.true;
				dirs.should.include(item);
				dirs.splice(dirs.indexOf(item), 1);
				i++;
			});
			i.should.equal(total);
			dirs.should.be.empty;
		});

	});

});