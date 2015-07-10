var DataBase = require('../src/index');
var db = DataBase('../tmp/db.json');

var collection = [{"nombre":"Villareal","numero":1,"carreras":[{"nombre":"Fisico","rating":4.3,"cursos":[{"nombre":"cuantica","id":1},{"nombre":"algebra","id":2}]},{"nombre":"Matematica","rating":4,"cursos":[{"nombre":"algebra","id":2},{"nombre":"Aritmetica","id":3}]}]},{"nombre":"San Marcos","numero":2,"carreras":[{"nombre":"Medicina","rating":9.6,"cursos":[{"nombre":"Quimica","id":4},{"nombre":"Biologia","id":5}]},{"nombre":"Metalurgia","rating":5,"cursos":[{"nombre":"quimica","id":4},{"nombre":"Fisica","id":5}]}]}];

/*
  first create a folder ./tmp
*/


/* 
  run this command one time
*/
// collection.forEach(function(document){
//   db('universidades').push(document);
// });

/* Result:
          [ { nombre: 'Villareal',
            numero: 1,
            carreras: [ [Object], [Object] ] } ]
*/
console.log(
db('universidades')
  .chain()
  .whereAll({ 'carreras.cursos.nombre': 'cuantica'})
  .value()
)

//or
/*
  [ { nombre: 'cuantica', id: 1 } ]
*/

db('universidades').findAll({ 'carreras.cursos.nombre': 'cuantica'})

//modifies all fields with cuantica value
console.log(
db('universidades')
  .chain()
  .updateAll({'carreras.cursos.nombre': 'cuantica'}, {'nombre': 'mecanica'})
  .value()
)
//or
console.log(
db('universidades')
  .chain()
  .findAll('carreras.cursos.nombre': 'cuantica')
  .updateAll({'nombre': 'mecanica'})
  .value()
)

// push all fields with cuantica value at third level
console.log(
db('universidades')
  .chain()
  .pushAll({'carreras.cursos.nombre': 'cuantica'}, {'nombre': 'javascript', 'id': 100})
  .value()
)
//or
console.log(db('universidades')
  .chain()
  .findAll({"carreras.rating": 4.3})
  .pushAll({"cursos": {'nombre': 'javascript', 'id': 100})
  .value()
)

// remove value at third level
console.log(
db('universidades')
  .chain()
  .removeAll({'carreras.cursos.nombre': 'cuantica'})
  .value()
)