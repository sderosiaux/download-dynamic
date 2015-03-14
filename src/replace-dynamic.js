var error = console.error;
var RE_dynamicPart = /{(.*?)}/g;

module.exports = function replaceDynamic(url, opts) {
    var originalUrl = url;

    // ensure opts is not null
    opts = opts || {};

    var newRE = new RegExp('{(.+?)}');

    // find the first macro "{...}"
    var result = newRE.exec(url);
    var urls = [];

    // TODO: refactor and do not use a recursive, I'm sure there is a way simpler way to compute the combinaisons.

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
        var buildUrl = function(value) {
            url = originalUrl.replace(match, value);
            urls = urls.concat(replaceDynamic(url, opts));
        };

        // let's go
        getDynamicValues(buildUrl);

    } else {
        // no dynamic part, add it
        urls.push(url);
    }

    return urls;
}