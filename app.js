var dd = require('./src/download-dynamic.js');
var argv = require('minimist')(process.argv.slice(2));

var url = argv._[0];
var opts = {};

var RE_range = /([0-9]+),([0-9]+)/g;

Object.keys(argv).forEach(function(key) {
	// ignore the '_' key
	if (key === '_') {
		return;
	}

	var value = argv[key];

	// ignore empty value
	// we need value in all cases for now
	if (!value) {
		return;
	}

	// is it a range?
	var range = RE_range.exec(value);
	if (range) {
		opts[key] = { min: range[1], max: range[2] };	
		return;
	}

	// treat it as a set of discrete values
	var discreteValues = value.split('|');
	opts[key] = discreteValues;
})

dd(url, opts);

// node download-dynamic.js http://example.com/page-{num} page=0,99
