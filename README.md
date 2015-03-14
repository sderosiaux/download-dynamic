Download the content of multiple urls from a single url containing dynamic parts (macros).

## How to use it

If you have `npm install download-dynamic`, you can do :

```javascript
var dd = require('download-dynamic');
dd.download('http://example.com/cat-{cat}/page-{page}/{suffix}', {
	page: { min: 1, max: 4 },
	suffix: [ 'ryelth', 'roddington', 'odiham' ],
	cat: { min: 100, max: 102 }
});
```

That will download every resources of the url by replacing each macros with the values you specified.


## Command line

If you have `npm install -g download-dynamic`, you can do :

```
$ download-dynamic url [macros]
```
`url` can have macros inside, ie: string encapsulated into curly brackets : `{macro}`
Those macros will be replaced by what you specify.

`macros` can have 2 forms :
- `--page 1,10` : create a range from 1 to 10 (inclusive) for `{page}`
- `--suffix 'json|xml|atom|foo'` : iterate through each value for `{suffix}`

## Example

```
$ download-dynamic http://example.com/cat-{cat}/page-{page}/{suffix} --page 1,4 --suffix 'ryelth|roddington|odiham' --cat 100,102
[ 'http://example.com/cat-100/page-1/{suffix}',
  'http://example.com/cat-100/page-2/ryelth',
  'http://example.com/cat-100/page-2/roddington',
  'http://example.com/cat-100/page-2/odiham',
  'http://example.com/cat-100/page-3/ryelth',
  'http://example.com/cat-100/page-3/roddington',
  'http://example.com/cat-100/page-3/odiham',
  'http://example.com/cat-100/page-4/ryelth',
  'http://example.com/cat-100/page-4/roddington',
  'http://example.com/cat-100/page-4/odiham',
  'http://example.com/cat-101/page-1/{suffix}',
  'http://example.com/cat-101/page-2/ryelth',
  'http://example.com/cat-101/page-2/roddington',
  'http://example.com/cat-101/page-2/odiham',
  'http://example.com/cat-101/page-3/ryelth',
  'http://example.com/cat-101/page-3/roddington',
  'http://example.com/cat-101/page-3/odiham',
  'http://example.com/cat-101/page-4/ryelth',
  'http://example.com/cat-101/page-4/roddington',
  'http://example.com/cat-101/page-4/odiham',
  'http://example.com/cat-102/page-1/{suffix}',
  'http://example.com/cat-102/page-2/ryelth',
  'http://example.com/cat-102/page-2/roddington',
  'http://example.com/cat-102/page-2/odiham',
  'http://example.com/cat-102/page-3/ryelth',
  'http://example.com/cat-102/page-3/roddington',
  'http://example.com/cat-102/page-3/odiham',
  'http://example.com/cat-102/page-4/ryelth',
  'http://example.com/cat-102/page-4/roddington',
  'http://example.com/cat-102/page-4/odiham' ]
  ```