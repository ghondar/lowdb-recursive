# lowdb-recursive

> Quick dot-notation seeker

if you know for the first time lowdb, please go [here](https://github.com/typicode/lowdb)

## Add Documents

```javascript
var low = require('lowdb-recursive')

var db = low('db.json')

var collection = [
    {
      "nombre": "Villareal",
      "numero": 1,
      "carreras": [
        {
          "nombre": "Fisico",
          "rating": 4.3,
          "cursos": [
            {
              "nombre": "cuantica",
              "id": 1
            },
            {
              "nombre": "algebra",
              "id": 2
            }
          ]
        },
        {
          "nombre": "Matematica",
          "rating": 4,
          "cursos": [
            {
              "nombre": "algebra",
              "id": 2
            },
            {
              "nombre": "Aritmetica",
              "id": 3
            }
          ]
        }
      ]
    },
    {
      "nombre": "San Marcos",
      "numero": 2,
      "carreras": [
        {
          "nombre": "Medicina",
          "rating": 9.6,
          "cursos": [
            {
              "nombre": "Quimica",
              "id": 4
            },
            {
              "nombre": "Biologia",
              "id": 5
            }
          ]
        },
        {
          "nombre": "Metalurgia",
          "rating": 5,
          "cursos": [
            {
              "nombre": "quimica",
              "id": 4
            },
            {
              "nombre": "Fisica",
              "id": 5
            }
          ]
        }
      ]
    }
  ]

collection.forEach(function(document){
  db('universidades').push(document);
});

```
## Find

```javascript

db('universidades').findAll({ 'carreras.cursos.nombre': 'cuantica'})

```

## Update and get values
  
```javascript

db('universidades')
  .chain()
  .findAll({ 'carreras.cursos.nombre': 'cuantica'})
  .updateAll({'carreras.cursos.nombre': 'mecanica'}, {'nombre': 'cuantica'})
  .value()

```
