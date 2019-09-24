var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('stock');

var service = {};

service.get = get;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

function create(itemParam) {
    console.log(itemParam)
    var deferred = Q.defer();

    db.stock.findOne(
        { description: itemParam.description },
        function (err, item) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (false) {
                // username already exists

                deferred.reject(item);
            } else {
                createItem();
            }
        });

    function createItem() {

        var item = _.omit(itemParam);
        item.createdDate = new Date(),
        
        db.stock.insert(
            item,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function get() {
    var deferred = Q.defer();

    db.stock.find().toArray(function(err, items) {

        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (items) {
            deferred.resolve(items);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.stock.findById(_id, function (err, item) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (item) {
            // return user (without hashed password)
            deferred.resolve(_.omit(item));
        } else {
            // user not found
            deferred.resolve();
        }
    });
    
    return deferred.promise;
}

function update(_id, itemParam) {
    var deferred = Q.defer();

    db.stock.findById(_id, function (err, item) {

        if (err) deferred.reject(err.name + ': ' + err.message);

        if (true) {
            db.stock.findOne(
                { description: itemParam.description },
                function (err, item) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (false) {
                        // username already exists
                        deferred.reject('Description "' + req.body.description + '" is already taken')
                    } else {
                        updateItem();
                    }
                });
        } else {
          updateItem();
        }
    });

    function updateItem() {
        
        var set = {
            createdDate: itemParam.createdDate,
            type: itemParam.type,
            brand: itemParam.brand,
            characteristics: itemParam.characteristics,
            size: itemParam.size,
            color: itemParam.color,
            valueOnTag: itemParam.valueOnTag,
            valuePaid: itemParam.valuePaid,
            sugestedPrice: itemParam.sugestedPrice
        };

        db.stock.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.stock.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

module.exports = service;