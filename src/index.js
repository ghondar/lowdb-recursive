var _ = require('lodash');
var low = require('lowdb');

var DataBase = function(path){
  var db = low(path, {
    autosave: true,
    async: false
  });
  db._.mixin({
    recursive: function(update, array, where, value, cb, count, envio){
      where = where.split('.');
      var that = this;
      var list = [];
      if(count)
        count++;
      else
        count = 1
      if(_.compact(where).length > 1){
        var state = where.shift();
        _.forEach(array, function(document){
          if(document[state] && count == 1)
            that.recursive(update, document[state], where.join('.'), value, cb, count, document);
          else
            that.recursive(update, document[state], where.join('.'), value, cb, count, envio);
        })
      }else{
        var json = {};
        json[where.join()] = value;
        if(update){
          var value = _.where(array, update);
          _.forEach(value, function(val){
            _.assign(val, json)
          });
          if(count === 1)
            cb(dato);
          else
            cb(envio)
        }else{
          // console.log(array, json)
          var dato = _.where(array, json);
          if(dato.length > 0){        
            if(count === 1)
              cb(dato);
            else
              cb(envio)
          }
        }      
      }
    },
    findAll: function(array, where){
      var list = []; 
      var that = this;
      _.forIn(where, function(value, key){
          that.recursive(null, array, key, value, function(dato){
          if(!(Object.prototype.toString.call( dato ) === '[object Array]') )
            list.push(dato)
          else
            _.forEach(dato, function(value){
              list.push(value)
            });
        });
        array = list;
        list = [];
      });
      var val = {};
      var listFinal = []
      _.forEach(array, function(document){
        if(!_.isEqual(val, document)){
          val = document
          listFinal.push(document);
        }
      })
      array = listFinal;
      return array;
    },
    updateAll: function(array, update, where){
      var list = []; 
      var that = this;
      _.forIn(update, function(value, key){
        that.recursive(where, array, key, value, function(dato){
          if(!(Object.prototype.toString.call( dato ) === '[object Array]') )
            list.push(dato)
          else
            _.forEach(dato, function(value){
              list.push(value)
            });
        });
        array = list;
        list = [];
      });
      return array;
    }
  });
  return db;
}
module.exports = DataBase;