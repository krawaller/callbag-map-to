# callbag-map-to

[Callbag](https://github.com/callbag/callbag) operator that transforms data passing to it to a fixed value.

`npm install callbag-map-to`

## example

```js
const fromIter = require('callbag-from-iter');
const forEach = require('callbag-for-each');
const mapTo = require('callbag-map-to');

const source = mapTo('foo')(fromIter([1,2,3]));

iterate(x => console.log(x))(source); // 'foo'
                                      // 'foo'
                                      // 'foo'
```
