var expect = require('chai').expect;
var replaceDynamic = require('../src/replace-dynamic.js');

describe('macros replacement', function() {
	it('should work without macro: http://www.example.com', function() {
		var url = 'http://www.example.com';
		var result = replaceDynamic(url)
		expect(result).to.be.eql([ url ]);
	});

	it('should work with curly braces non forming macros: http://www.example.com/test}/{la{', function() {
		var url = 'http://www.example.com/test}/{la{';
		var result = replaceDynamic(url)
		expect(result).to.be.eql([ url ]);
	});

	it('should work with empty macro: http://www.example.com/{}', function() {
		var url = 'http://www.example.com/{}';
		var result = replaceDynamic(url)
		expect(result).to.be.eql([ url ]);
	});

	it('should not work with a macro that has no config: http://www.example.com/page/{page}', function() {
		var url = 'http://www.example.com/page/{page}';
		expect(replaceDynamic.bind(null, url)).to.throw(Error);
	});

	it('should not work with a macro that has no config even if another has: http://www.example.com/{category}/page/{page}', function() {
		var url = 'http://www.example.com/{category}/page/{page}';
		expect(replaceDynamic.bind(null, url, { category: ['a', 'b'] })).to.throw(Error);
	});

	it('should work with a macro that has a discrete set config: http://www.example.com/{category}', function() {
		var url = 'http://www.example.com/{category}';
		var result = replaceDynamic(url, { category: ['a', 'b', 'c'] });
		expect(result).to.be.eql([
			'http://www.example.com/a',
			'http://www.example.com/b',
			'http://www.example.com/c'
		]);
	});

	it('should work with a macro that has a range config: http://www.example.com/page/{page}', function() {
		var url = 'http://www.example.com/page/{page}';
		var result = replaceDynamic(url, { page: { min: 0, max: 5 } });
		expect(result).to.be.eql([
			'http://www.example.com/page/0',
			'http://www.example.com/page/1',
			'http://www.example.com/page/2',
			'http://www.example.com/page/3',
			'http://www.example.com/page/4',
			'http://www.example.com/page/5',
		]);
	});

	it('should work with 2 macros that have a discrete set config: http://www.example.com/{klass}/{season}', function() {
		var url = 'http://www.example.com/{klass}/{season}';
		var result = replaceDynamic(url, { klass: ['barb', 'dh'], season: [ 's1', 's2'] });
		expect(result).to.be.eql([
			'http://www.example.com/barb/s1',
			'http://www.example.com/barb/s2',
			'http://www.example.com/dh/s1',			
			'http://www.example.com/dh/s2'			
		]);
	});

	it('should work with 2 macros that have a range config: http://www.example.com/{cat}/{page}', function() {
		var url = 'http://www.example.com/{cat}/{page}';
		var result = replaceDynamic(url, { cat: { min: -2, max: 1 }, page: { min: 1, max: 3 } });
		expect(result).to.be.eql([
			'http://www.example.com/-2/1',
			'http://www.example.com/-2/2',
			'http://www.example.com/-2/3',
			'http://www.example.com/-1/1',
			'http://www.example.com/-1/2',
			'http://www.example.com/-1/3',
			'http://www.example.com/0/1',
			'http://www.example.com/0/2',
			'http://www.example.com/0/3',
			'http://www.example.com/1/1',
			'http://www.example.com/1/2',
			'http://www.example.com/1/3'
		]);
	});

	it('should work with multiple macros of different types: http://www.example.com/{klass}/{season}/{mode}/{page}', function() {
		var url = 'http://www.example.com/{klass}/{season}/{mode}/{page}';
		var result = replaceDynamic(url, { klass: [ 'barb', 'dh' ], season: { min: 1, max: 2}, mode: [ 'sc', 'hc'], page: { min: 1, max: 2 } });
		expect(result).to.be.eql([
			'http://www.example.com/barb/1/sc/1',
			'http://www.example.com/barb/1/sc/2',
			'http://www.example.com/barb/1/hc/1',
			'http://www.example.com/barb/1/hc/2',

			'http://www.example.com/barb/2/sc/1',
			'http://www.example.com/barb/2/sc/2',
			'http://www.example.com/barb/2/hc/1',
			'http://www.example.com/barb/2/hc/2',

			'http://www.example.com/dh/1/sc/1',
			'http://www.example.com/dh/1/sc/2',
			'http://www.example.com/dh/1/hc/1',
			'http://www.example.com/dh/1/hc/2',

			'http://www.example.com/dh/2/sc/1',
			'http://www.example.com/dh/2/sc/2',
			'http://www.example.com/dh/2/hc/1',
			'http://www.example.com/dh/2/hc/2'
		]);
	});
});