var fs = require('fs')
var assert = require('assert')
var rmrf = require('rimraf')
var low = require('../src/index')

/* global beforeEach, describe, it */

var tempDir = __dirname + '/../tmp'
var syncFile = tempDir + '/sync.json'

var collectionPush = [ { nombre: 'Villareal', numero: 1, carreras: [ { nombre: 'Fisico', rating: 4.3, cursos: [ { nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 } ] }, { nombre: 'Matematica', rating: 4, cursos: [ { nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 } ] } ] }, { nombre: 'SanMarcos', numero: 2, carreras: [ { nombre: 'Medicina', rating: 9.6, cursos: [ { nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 } ] }, { nombre: 'Metalurgia', rating: 5, cursos: [ { nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 } ] } ] } ]
var collection = [ { nombre: 'Villareal', numero: 1, carreras: [ { nombre: 'Fisico', rating: 4.3, cursos: [ { nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 } ] }, { nombre: 'Matematica', rating: 4, cursos: [ { nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 } ] } ] }, { nombre: 'SanMarcos', numero: 2, carreras: [ { nombre: 'Medicina', rating: 9.6, cursos: [ { nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 } ] }, { nombre: 'Metalurgia', rating: 5, cursos: [ { nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 } ] } ] } ]
var pushAll = [ { nombre: 'Villareal', numero: 1, carreras: [ { nombre: 'Fisico', rating: 4.3, cursos: [ { nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }, { nombre: 'javascript', id: 100 } ] }, { nombre: 'Matematica', rating: 4, cursos: [ { nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 } ] } ] }, { nombre: 'SanMarcos', numero: 2, carreras: [ { nombre: 'Medicina', rating: 9.6, cursos: [ { nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 } ] }, { nombre: 'Metalurgia', rating: 5, cursos: [ { nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 } ] } ] } ]
var whereAll = [ { nombre: 'Villareal', numero: 1, carreras: [ { nombre: 'Fisico', rating: 4.3, cursos: [ { nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 } ] }, { nombre: 'Matematica', rating: 4, cursos: [ { nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 } ] } ] } ]

describe('LowDB', function () {
  var db

  beforeEach(function () {
    rmrf.sync(tempDir)
    fs.mkdirSync(tempDir)
  })

  describe('CRUD', function () {
    beforeEach(function () {
      db = low(syncFile)
    })

    it('pushAll', function () {
      collectionPush.forEach(function (document) {
        db('universidades').push(document)
      })
      db('universidades').pushAll({ 'carreras.cursos.nombre': 'cuantica' }, { nombre: 'javascript', id: 100 })
      assert.equal(db('universidades').size(), 2)
      assert.deepEqual(db.object, { universidades: pushAll })
    })

    it('findAll && pushAll', function () {
      collectionPush.forEach(function (document) {
        db('universidades').push(document)
      })
      db('universidades')
        .chain()
        .findAll({ 'carreras.rating': 4.3 })
        .pushAll({ cursos: { nombre: 'javascript', id: 100 } })
      assert.equal(db('universidades').size(), 2)
      assert.deepEqual(db.object, { universidades: pushAll })
    })

    it('whereAll', function () {
      collection.forEach(function (document) {
        db('universidades').push(document)
      })
      assert.deepEqual(db('universidades').whereAll({ 'carreras.cursos.nombre': 'cuantica' }), whereAll)
    })

    it('updateAll', function () {
      collection.forEach(function (document) {
        db('universidades').push(document)
      })
      db('universidades')
        .updateAll({ 'carreras.cursos.nombre': 'cuantica' }, { nombre: 'mecanica' })
      assert(!db('universidades').chain().findAll({ 'carreras.cursos.nombre': 'mecanica' }).isUndefined().value())
    })

    it('findAll && updateAll', function () {
      collection.forEach(function (document) {
        db('universidades').push(document)
      })
      db('universidades')
        .chain()
        .findAll({ 'carreras.cursos.nombre': 'cuantica' })
        .updateAll({ nombre: 'mecanica' })
      assert(!db('universidades').chain().findAll({ 'carreras.cursos.nombre': 'mecanica' }).isUndefined().value())
    })

    it('removeAll', function () {
      collection.forEach(function (document) {
        db('universidades').push(document)
      })
      db('universidades')
        .removeAll({ 'carreras.cursos.nombre': 'cuantica' })
      assert(db('universidades').chain().findAll({ 'carreras.cursos.nombre': 'cuantica' }).value().length === 0)
    })
  })
})
