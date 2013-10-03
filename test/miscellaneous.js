'use strict';

var fs = require('../index');
var path = require('path');
var should = require('should');
var h = require('./lib/helpers');

var tmp = 'tmp';

/**
 * Detect and return the indentation.
 *
 * @param  {String} string
 *
 * @return {Mixed} Indentation used, or undefined.
 */
function detectIndentation(string) {
	var tabs = string.match(/^[\t]+/gm) || [];
	var spaces = string.match(/^[ ]+/gm) || [];

	// Pick the smallest indentation level of a prevalent type
	var prevalent = tabs.length >= spaces.length ? tabs : spaces;
	var indentation;
	for (var i = 0, il = prevalent.length; i < il; i++) {
		if (!indentation || prevalent[i].length < indentation.length) {
			indentation = prevalent[i];
		}
	}
	return indentation;
}

describe('Miscellaneous:', function () {

	afterEach(function () {
		fs.emptyDirSync(tmp);
	});

	describe('.uniquePath()', function () {

		it('should return the same path when it doesn\'t exist', function (done) {
			var oldPath = path.join(tmp, h.rndstr());
			fs.uniquePath(oldPath, function (newPath) {
				oldPath.should.equal(newPath);
				done();
			});
		});

		it('should return unique path when file does exist', function (done) {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			fs.uniquePath(oldPath, function (newPath) {
				oldPath.should.not.equal(newPath);
				fs.existsSync(newPath).should.be.false;
				done();
			});
		});

		it('should accept custom starting suffix index as a 2nd argument', function (done) {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			fs.uniquePath(oldPath, 10, function (newPath) {
				oldPath.should.not.equal(newPath);
				fs.existsSync(newPath).should.be.false;
				newPath.should.match(/-10$/i);
				done();
			});
		});

		it('should keep file extension at the end of a filename', function (done) {
			var oldPath = path.join(tmp, h.rndstr() + '.tar.gz');
			fs.createFileSync(oldPath);
			fs.uniquePath(oldPath, function (newPath) {
				oldPath.should.not.equal(newPath);
				fs.existsSync(newPath).should.be.false;
				newPath.should.match(/-2\.tar\.gz$/i);
				done();
			});
		});

		it('should increment suffix until unique path is reached', function (done) {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			fs.createFileSync(oldPath + '-2');
			fs.createFileSync(oldPath + '-3');
			fs.uniquePath(oldPath, function (newPath) {
				oldPath.should.not.equal(newPath);
				fs.existsSync(newPath).should.be.false;
				newPath.should.match(/-4$/i);
				done();
			});
		});

	});

	describe('.uniquePathSync()', function () {

		it('should return the same path when it doesn\'t exist', function () {
			var oldPath = path.join(tmp, h.rndstr());
			var newPath = fs.uniquePathSync(oldPath);
			oldPath.should.equal(newPath);
		});

		it('should return unique path when file does exist', function () {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			var newPath = fs.uniquePathSync(oldPath);
			oldPath.should.not.equal(newPath);
			fs.existsSync(newPath).should.be.false;
		});

		it('should accept custom starting suffix index as a 2nd argument', function () {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			var newPath = fs.uniquePathSync(oldPath, 10);
			oldPath.should.not.equal(newPath);
			fs.existsSync(newPath).should.be.false;
			newPath.should.match(/-10$/i);
		});

		it('should keep file extension at the end of a filename', function () {
			var oldPath = path.join(tmp, h.rndstr() + '.tar.gz');
			fs.createFileSync(oldPath);
			var newPath = fs.uniquePathSync(oldPath);
			oldPath.should.not.equal(newPath);
			fs.existsSync(newPath).should.be.false;
			newPath.should.match(/-2\.tar\.gz$/i);
		});

		it('should increment suffix until unique path is reached', function () {
			var oldPath = path.join(tmp, h.rndstr());
			fs.createFileSync(oldPath);
			fs.createFileSync(oldPath + '-2');
			fs.createFileSync(oldPath + '-3');
			var newPath = fs.uniquePathSync(oldPath);
			oldPath.should.not.equal(newPath);
			fs.existsSync(newPath).should.be.false;
			newPath.should.match(/-4$/i);
		});

	});

	var obj = {
		foo: 1,
		bar: 'bfaregr',
		baz: [
			'John',
			'Mike',
			'Adam'
		]
	};

	describe('.writeJSON()', function () {

		it('should write object into a JSON file', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSON(filePath, obj, function (err) {
				should.not.exist(err);
				JSON.stringify(obj).should.equal(String(fs.readFileSync(filePath)));
				done();
			});
		});

		it('should set indentation to number of spaces when number is passed', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSON(filePath, obj, 3, function (err) {
				should.not.exist(err);
				detectIndentation(String(fs.readFileSync(filePath))).should.equal('   ');
				done();
			});
		});

		it('should set indentation to a custom character when non-number is passed', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSON(filePath, obj, '\t', function (err) {
				should.not.exist(err);
				detectIndentation(String(fs.readFileSync(filePath))).should.equal('\t');
				done();
			});
		});

	});

	describe('.writeJson()', function () {

		it('should be an alias of .writeJSON()', function () {
			fs.writeJson.should.equal(fs.writeJSON);
		});

	});

	describe('.writeJSONSync()', function () {

		it('should write object into a JSON file', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSONSync(filePath, obj);
			JSON.stringify(obj).should.equal(String(fs.readFileSync(filePath)));
		});

		it('should set indentation to number of spaces when number is passed', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSONSync(filePath, obj, 3);
			detectIndentation(String(fs.readFileSync(filePath))).should.equal('   ');
		});

		it('should set indentation to a custom character when non-number is passed', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSONSync(filePath, obj, '\t');
			detectIndentation(String(fs.readFileSync(filePath))).should.equal('\t');
		});

	});

	describe('.writeJsonSync()', function () {

		it('should be an alias of .writeJSONSync()', function () {
			fs.writeJsonSync.should.equal(fs.writeJSONSync);
		});

	});

	describe('.readJSON()', function () {

		it('should read a JSON file', function (done) {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSONSync(filePath, obj);
			fs.readJSON(filePath, function (err, data) {
				should.not.exist(err);
				JSON.stringify(data).should.equal(JSON.stringify(obj));
				done();
			});
		});

	});

	describe('.readJson()', function () {

		it('should be an alias of .readJSON()', function () {
			fs.readJson.should.equal(fs.readJSON);
		});

	});

	describe('.readJSONSync()', function () {

		it('should read a JSON file', function () {
			var filePath = path.join(tmp, h.rndstr());
			fs.writeJSONSync(filePath, obj);
			var data = fs.readJSONSync(filePath);
			JSON.stringify(data).should.equal(JSON.stringify(obj));
		});

	});

	describe('.readJsonSync()', function () {

		it('should be an alias of .readJSON()', function () {
			fs.readJsonSync.should.equal(fs.readJSONSync);
		});

	});

});