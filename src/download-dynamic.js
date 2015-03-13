var download = require('download-collection');
var error = console.error;
var RE_dynamicPart = /{(.*?)}/g;

function replaceDynamic(url, opts) {
    var originalUrl = url;
    // find the first macro "{...}"
    var result = RE_dynamicPart.exec(url);
    var urls = [];

    // we found one ?
    if (result) {
        // get the macro name {toto} => 'toto'
        var match = result[0];
        var macro = result[1];

        // check if we have a config to apply for this dynamic part
        var partOptions = opts[macro];
        if (!partOptions) {
            throw Error('No dynamic associated with {' + macro + '}')
        }

        // are we going to have a url without anything more to replace?
        var noMoreDynamic = RE_dynamicPart.exec(url) == null;

        // create the values from the dynamic part options
        // right now, 2 types are handled :
        // - range: { min: 0, max: 10 }
        // - set: [ 'xml', 'json', 'atom' ]
        var getDynamicValues = (function(callback) {
        	// discrete set of values
        	if (Array.isArray(partOptions)) {
    			partOptions.forEach(function(replacement) {
					callback(replacement);
    			});
    			return;
        	}

        	// range min to max inclusive
    		if (partOptions.min !== undefined && partOptions.max !== undefined) {
    			for (var i = partOptions.min; i <= partOptions.max; i++) {
    				callback(i);
    			}
    			return;
    		}
        });

        // replace the current match with the given value
        // apply the dynamic part and continue to process the rest of the url
        // in case there is other macro
        var buildUrl = function(value) {
			url = originalUrl.replace(match, value);
			if (noMoreDynamic) {
                // no, our url is done !
                urls.push(url);
            } else {
                // yes, our url is not done yet, recursive call
                urls = urls.concat(replaceDynamic(url, opts));
            }
        };

        // let's go
		getDynamicValues(buildUrl);
    }

    return urls;
}

module.exports = function(url, opts) {
    var urls = replaceDynamic(url, opts);
    console.log(urls);
    //download(urls);
};
