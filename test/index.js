var fs = require('fs')
var assert = require('assert')
var rmrf = require('rimraf')
var path = require('path')
var low = require('../src/index')

/* global beforeEach, describe, it */

var tempDir = path.join(__dirname, '..', 'tmp')
var syncFile = path.join(tempDir, 'sync.json')

const firstCollectionPush = [{ nombre: 'Villareal', numero: 1, carreras: [{ nombre: 'Fisico', rating: 4.3, cursos: [{ nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }] }, { nombre: 'Matematica', rating: 4, cursos: [{ nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 }] }] }, { nombre: 'SanMarcos', numero: 2, carreras: [{ nombre: 'Medicina', rating: 9.6, cursos: [{ nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 }] }, { nombre: 'Metalurgia', rating: 5, cursos: [{ nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 }] }] }]
const secondCollectionPush = [{ nombre: 'Villareal', numero: 1, carreras: [{ nombre: 'Fisico', rating: 4.3, cursos: [{ nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }] }, { nombre: 'Matematica', rating: 4, cursos: [{ nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 }] }] }, { nombre: 'SanMarcos', numero: 2, carreras: [{ nombre: 'Medicina', rating: 9.6, cursos: [{ nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 }] }, { nombre: 'Metalurgia', rating: 5, cursos: [{ nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 }] }] }]
const collection = [{ nombre: 'Villareal', numero: 1, carreras: [{ nombre: 'Fisico', rating: 4.3, cursos: [{ nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }] }, { nombre: 'Matematica', rating: 4, cursos: [{ nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 }] }] }, { nombre: 'SanMarcos', numero: 2, carreras: [{ nombre: 'Medicina', rating: 9.6, cursos: [{ nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 }] }, { nombre: 'Metalurgia', rating: 5, cursos: [{ nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 }] }] }]
const pushAll = [{ nombre: 'Villareal', numero: 1, carreras: [{ nombre: 'Fisico', rating: 4.3, cursos: [{ nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }, { nombre: 'javascript', id: 100 }] }, { nombre: 'Matematica', rating: 4, cursos: [{ nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 }] }] }, { nombre: 'SanMarcos', numero: 2, carreras: [{ nombre: 'Medicina', rating: 9.6, cursos: [{ nombre: 'Quimica', id: 4 }, { nombre: 'Biologia', id: 5 }] }, { nombre: 'Metalurgia', rating: 5, cursos: [{ nombre: 'quimica', id: 4 }, { nombre: 'Fisica', id: 5 }] }] }]
const whereAll = [{ nombre: 'Villareal', numero: 1, carreras: [{ nombre: 'Fisico', rating: 4.3, cursos: [{ nombre: 'cuantica', id: 1 }, { nombre: 'algebra', id: 2 }] }, { nombre: 'Matematica', rating: 4, cursos: [{ nombre: 'algebra', id: 2 }, { nombre: 'Aritmetica', id: 3 }] }] }]

describe('LowDB', function () {
  var db

  beforeEach(function () {
    rmrf.sync(tempDir)
    fs.mkdirSync(tempDir)
  })

  describe('CRUD', function () {
    beforeEach(function () {
      db = low(syncFile)
      db.defaults({ universidades: [] }).write()
    })

    it('pushAll', function () {
      for (const document of firstCollectionPush) {
        db.get('universidades').push(document).write()
      }
      db.get('universidades').pushAll({ 'carreras.cursos.nombre': 'cuantica' }, { nombre: 'javascript', id: 100 }).write()
      assert.strictEqual(db.get('universidades').size().value(), 2)
      assert.deepStrictEqual(db.value(), { universidades: pushAll })
    })

    it('findAll && pushAll', function () {
      for (const document of secondCollectionPush) {
        db.get('universidades').push(document).write()
      }
      db.get('universidades')
        .chain()
        .findAll({ 'carreras.rating': 4.3 })
        .pushAll({ cursos: { nombre: 'javascript', id: 100 } }).write()
      assert.strictEqual(db.get('universidades').size().value(), 2)
      assert.deepStrictEqual(db.value(), { universidades: pushAll })
    })

    it('whereAll', function () {
      for (const document of collection) {
        db.get('universidades').push(document).write()
      }
      assert.deepStrictEqual(db.get('universidades').whereAll({ 'carreras.cursos.nombre': 'cuantica' }).value(), whereAll)
    })

    it('updateAll', function () {
      for (const document of collection) {
        db.get('universidades').push(document).write()
      }
      db.get('universidades')
        .updateAll({ 'carreras.cursos.nombre': 'cuantica' }, { nombre: 'mecanica' })
      assert(!db.get('universidades').chain().findAll({ 'carreras.cursos.nombre': 'mecanica' }).isUndefined().value())
    })

    it('findAll && updateAll', function () {
      for (const document of collection) {
        db.get('universidades').push(document).write()
      }
      db.get('universidades')
        .chain()
        .findAll({ 'carreras.cursos.nombre': 'cuantica' })
        .updateAll({ nombre: 'mecanica' })
      assert(!db.get('universidades').chain().findAll({ 'carreras.cursos.nombre': 'mecanica' }).isUndefined().value())
    })

    it('removeAll', function () {
      for (const document of collection) {
        db.get('universidades').push(document).write()
      }
      db.get('universidades')
        .removeAll({ 'carreras.cursos.nombre': 'cuantica' }).write()
      assert(db.get('universidades').chain().findAll({ 'carreras.cursos.nombre': 'cuantica' }).value().length === 0)
    })
  })
})
