var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

//Get router - read data
router.get('/appointments', (req, res, next) => {
  req.collection.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));   //send errors to browser   
});

//Post router - write Data
router.post('/appointments', (req, res, next) => {
  const {appointmentDate, Name, Email} = req.body;
  if(!appointmentDate || !Name || !Email) {
    return res.status(400).json({
      message : 'Appointment Date, Name and the email are required!'
    });
  }

  const payload = {appointmentDate, Name, Email};
  req.collection.insertOne(payload)
    .then(result => res.json(result.ops[0]))
    .catch(error => res.send(error));
});

//Delete route
router.delete('/appointments/:id', (req, res, next) => {
  const { id } = req.params;
  const _id = ObjectID(id);  //convert the id to mongo object id

  req.collection.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error)); 
});


module.exports = router;
