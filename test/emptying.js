'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./lib/helpers');

var tmp = 'tmp';

describe('Emptying files:', function () {

	function createDummy() {
		var filePath = path.join(tmp, h.rndstr());
		var data = h.rndstr();
		fs.createFileSync(filePath, data);
		return filePath;
	}

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.emptyFile()', function () {

		it('should delete all contents of a file', function (done) {
			var filePath = createDummy();
			fs.emptyFile(filePath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.be.empty;
				done();
			});
		});

		it('should create a new file when it doesn\'t exist', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.existsSync(filePath).should.be.false;
			fs.emptyFile(filePath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.be.empty;
				done();
			});
		});

	});

	describe('.emptyFileSync()', function () {

		it('should delete all contents of a file', function () {
			var filePath = createDummy();
			fs.emptyFileSync(filePath);
			String(fs.readFileSync(filePath)).should.be.empty;
		});

		it('should create a new file when it doesn\'t exist', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.existsSync(filePath).should.be.false;
			fs.emptyFileSync(filePath);
			String(fs.readFileSync(filePath)).should.be.empty;
		});

	});

	describe('.empty()', function () {

		it('should delete all contents of a file when path to a file is passed', function (done) {
			var filePath = createDummy();
			fs.empty(filePath, function (err) {
				should.not.exist(err);
				String(fs.readFileSync(filePath)).should.be.empty;
				done();
			});
		});

	});

	describe('.emptySync()', function () {

		it('should delete all contents of a file when path to a file is passed', function () {
			var filePath = createDummy();
			fs.emptySync(filePath);
			String(fs.readFileSync(filePath)).should.be.empty;
		});

	});

});

describe('Emptying directories:', function () {
	var dirs = [
		'foo',
		'bar',
		'baz',
		path.join('baz', 'foo'),
		path.join('baz', 'bar', 'foo'),
	];
	var files = [
		path.join('bar', h.rndstr()),
		path.join('baz', 'bar', h.rndstr()),
		h.rndstr(),
		h.rndstr(),
	];

	function createDummy() {
		var dirPath = path.join(tmp, h.rndstr());
		dirs.forEach(function (dir) {
			fs.createDirSync(path.join(dirPath, dir));
		});
		files.forEach(function (file) {
			fs.createFileSync(path.join(dirPath, file), h.rndstr());
		});
		return dirPath;
	}

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.emptyDir()', function () {

		it('should delete everything inside a directory, but keep the directory itself', function (done) {
			var dirPath = createDummy();
			fs.emptyDir(dirPath, function (err) {
				should.not.exist(err);
				fs.readdirSync(dirPath).should.have.length(0);
				done();
			});
		});

		it('should create a directory when it doesn\'t exist', function (done) {
			var dirPath = path.join(tmp, h.rndstr());
			fs.existsSync(dirPath).should.be.false;
			fs.emptyDir(dirPath, function (err) {
				should.not.exist(err);
				fs.existsSync(dirPath).should.be.true;
				done();
			});
		});

	});

	describe('.emptyDirSync()', function () {

		it('should delete everything inside a directory, but keep the directory itself', function () {
			var dirPath = createDummy();
			fs.emptyDirSync(dirPath);
			fs.readdirSync(dirPath).should.have.length(0);
		});

		it('should create a directory when it doesn\'t exist', function () {
			var dirPath = path.join(tmp, h.rndstr());
			fs.existsSync(dirPath).should.be.false;
			fs.emptyDirSync(dirPath);
			fs.existsSync(dirPath).should.be.true;
		});

	});

	describe('.empty()', function () {

		it('should delete everything inside a directory when path to a directory is passed', function (done) {
			var dirPath = createDummy();
			fs.empty(dirPath, function (err) {
				should.not.exist(err);
				fs.readdirSync(dirPath).should.have.length(0);
				done();
			});
		});

	});

	describe('.emptySync()', function () {

		it('should delete everything inside a directory when path to a directory is passed', function () {
			var dirPath = createDummy();
			fs.emptySync(dirPath);
			fs.readdirSync(dirPath).should.have.length(0);
		});

	});

});