var download = require('download-collection');
var replaceDynamic = require('./replace-dynamic.js');

module.exports = function(url, opts) {
    var urls = replaceDynamic(url, opts);
    download(urls);
};
