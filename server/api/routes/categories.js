const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//---
const Categorie = require('../models/categorie');

//---get all----
router.get('/',(req, res, next) => {
    Categorie.find()
        .select("_id name description")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                categories: docs.map(doc => {
                  return {
                    _id: doc._id,
                    name: doc.name,
                    description: doc.description
                  };
                })
              };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//---get by id----
router.get('/:id',(req, res, next) => {
    const id = req.params.id;
    Categorie.findById(id)
        .select("_id name description")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    categorie: doc
                });
            } else {
                res.status(400).json({
                    message: 'No valide entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


//----post----
router.post('/',(req, res, next) => {
    const categorie = new Categorie({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    categorie
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Categorie created successfully',
                createdCategorie: {
                    _id: result._id,
                    name: result.name,
                    description: result.description
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    
});

//----put-----
router.put('/:id',(req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Categorie.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Categorie updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//----delete----
router.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    Categorie.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Categorie deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;