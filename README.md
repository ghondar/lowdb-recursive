# lowdb-recursive

> fast recursive seeker

# Example

```javascript
var lowRecursive = require('lowdb-recursive')
var db = lowRecursive('db.json')

db('posts')
  .push({ title: 'lowdb is awesome'})
```
