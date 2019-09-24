var express = require('express');
var router = express.Router();
var stockService = require('services/stock.service');

// routes
router.get('/', getStock);
router.post('/', registerItem);
router.get('/:_id', getItemById);
router.put('/:_id', updateItem);
router.delete('/:_id', deleteItem);

function registerItem(req, res) {
    let item = req.body;

  stockService.create(item)
  .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

function getStock(req, res) {

    stockService.get()
    .then(function (item) {
    if (item) {
        res.send(item);
    } else {
        res.sendStatus(404);
    }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
        
function getItemById(req, res) {
    
    stockService.getById(req.params._id)
    .then(function (item) {
        if (item) {
            res.send(item);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
        
function updateItem(req, res) {
    
    var itemId = req.params._id;
    
    if (req.params._id !== itemId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }
    
    stockService.update(itemId, req.body)
    .then(function () {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

function deleteItem(req, res) {
    
    stockService.delete(req.params._id)
    .then(function () {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

module.exports = router;