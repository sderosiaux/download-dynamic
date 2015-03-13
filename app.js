var dd = require('./src/download-dynamic.js');


dd('http://example.com/page-{page}/{suffix}', {
    page: {
        min: 0,
        max: 20
    },
    suffix: ['json', 'xml']
});

// node download-dynamic.js http://example.com/page-{num} page=0,99
