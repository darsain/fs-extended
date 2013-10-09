'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./helpers');

describe('Deleting files:', function () {

	function createDummy() {
		var filePath = path.join(h.tmp, h.rndstr());
		var data = h.rndstr();
		fs.createFileSync(filePath, data);
		return filePath;
	}

	describe('.deleteFile()', function () {

		it('should delete a file', function (done) {
			var filePath = createDummy();
			fs.deleteFile(filePath, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.false;
				done();
			});
		});

		it('should not throw an error when file doesn\'t exist', function (done) {
			var filePath = h.rndstr();
			fs.existsSync(filePath).should.be.false;
			fs.deleteFile(filePath, function (err) {
				should.not.exist(err);
				done();
			});
		});

	});

	describe('.deleteFileSync()', function () {

		it('should delete a file', function () {
			var filePath = createDummy();
			fs.deleteFileSync(filePath);
			fs.existsSync(filePath).should.be.false;
		});

		it('should not throw an error when file doesn\'t exist', function () {
			var filePath = h.rndstr();
			fs.existsSync(filePath).should.be.false;
			fs.deleteFileSync(filePath);
		});

	});


	describe('.delete()', function () {

		it('should delete a file when path to a file is passed', function (done) {
			var filePath = createDummy();
			fs.delete(filePath, function (err) {
				should.not.exist(err);
				fs.existsSync(filePath).should.be.false;
				done();
			});
		});

	});

	describe('.deleteSync()', function () {

		it('should delete a file when path to a file is passed', function () {
			var filePath = createDummy();
			fs.deleteSync(filePath);
			fs.existsSync(filePath).should.be.false;
		});

	});

});

describe('Deleting directories:', function () {
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
		var dirPath = path.join(h.tmp, h.rndstr());
		dirs.forEach(function (dir) {
			fs.createDirSync(path.join(dirPath, dir));
		});
		files.forEach(function (file) {
			fs.createFileSync(path.join(dirPath, file), h.rndstr());
		});
		return dirPath;
	}

	describe('.deleteDir()', function () {

		it('should delete directory, and everything inside it', function (done) {
			var dirPath = createDummy();
			fs.deleteDir(dirPath, function (err) {
				should.not.exist(err);
				fs.existsSync(dirPath).should.be.false;
				done();
			});
		});

		it('should not throw an error when directory doesn\'t exist', function (done) {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.existsSync(dirPath).should.be.false;
			fs.deleteDir(dirPath, function (err) {
				should.not.exist(err);
				done();
			});
		});

	});

	describe('.deleteDirSync()', function () {

		it('should delete directory, and everything inside it', function () {
			var dirPath = createDummy();
			fs.deleteDirSync(dirPath);
			fs.existsSync(dirPath).should.be.false;
		});

		it('should not throw an error when directory doesn\'t exist', function () {
			var dirPath = path.join(h.tmp, h.rndstr());
			fs.existsSync(dirPath).should.be.false;
			fs.deleteDirSync(dirPath);
		});

	});


	describe('.delete()', function () {

		it('should delete a directory when path to a directory is passed', function (done) {
			var dirPath = createDummy();
			fs.delete(dirPath, function (err) {
				should.not.exist(err);
				fs.existsSync(dirPath).should.be.false;
				done();
			});
		});

	});

	describe('.deleteSync()', function () {

		it('should delete a directory when path to a directory is passed', function () {
			var dirPath = createDummy();
			fs.deleteSync(dirPath);
			fs.existsSync(dirPath).should.be.false;
		});

	});

});