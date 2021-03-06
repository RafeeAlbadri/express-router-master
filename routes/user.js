
/*
 * This file handel all /api/user Routes
 *
 */

// Dependencies
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const User = require('../models/users');



/*
 *  @TODO you can use below to create a more complex Queries
 *  eq  Equal
 *  ne  Eot Equal
 *  gt  Greater Than
 *  gte Greater Than or Equal
 *  ls  Less Than
 *  lte Less Than or Equal
 *  in  Contain
 *  nin Not in
 *  //  Example:
 *  .find({ age: { $gte: 18, $lt: 40 } })  Means that the age should be >= 18 AND less than 40
 *  .find({ age: { $in: [18, 19, 20] } })  Means that the age should equal one of the array items
 *  // Adding OR operator
 *  Keep the find() emplty just like that then write your or operator, just like below
 *  .find().or([ { age: { $gte: 18 } }, { name: 'Hamdon' } ])
 *  //
 *
 *  @TODO
 *  You Can Set a Pagination Like This:
 *
 *  const pageNumber = 1;
 *  const pageSize = 10;
 *  .skip((pageNumber - 1) * pageSize)
 *
 *
 */

// Getting all users
router.get('/', (req, res) => {
  User.find({ name:'Hamdon', age: 24}) // This is means WHERE NAME == Hamdon && AGE == 24
  .limit(10)  //  This for setting a limit to the requesr
  .sort({ name: 1 })  //  Sorting according the name 1 mean asc -1 means desc
  .select({ name: 1, age: 24 }) //  Means that get me the name and age only
  .then(result => {
    res.send(result);
  }).catch(err => {
    res.status(400).send(err)
  })
})

// Getting information
router.get('/:id', (req, res) => {
  User.findById(req.params.id).then(result => {
    if(!result){
      res.status(404).send('There is no such user');
    }
    res.send(result);
  }).catch(err => {
    res.status(400).send(err.message)
  });
});


// Adding a new User
router.post('/', (req, res) => {
  // Setting Schema so i can validate it
  const validating = userValidating(req.body);
  if(validating.error){
    res.status(400).send(validating.error.details);
  }else {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      age: req.body.age
    });
    user.save()
    .then(result => {
     res.send(result)
    })
    .catch(err => {
      console.log(err);
    });
  }
});


// PUT
router.put('/:id', (req, res) => {
  // If req.body is valid
  const validating = userValidating(req.body);
  //  If the validation fails
  if(validating.error){
    res.status(400).send(validating.error.details);
  }else {
    //  You can use updateMany
    User.updateOne( { _id: req.params.id },{ $set:req.body } )
    .then(result => {
      res.send(`Number of updated users is ${ result.n }`);
    }).catch(err => {
      res.status(400).send(err);
    });
  }
});


// Deleting a user
router.delete('/:id', (req, res) => {
  User.remove({name: req.params.id}).then(result => {
    res.send(`Number of deleted users is ${result.n}`)
  }).catch(err => {
    res.status(400).send(err);
  });
});



//  To validate the POST PUT requestes
function userValidating(user) {
  const userSchema = {
    'name': Joi.string().min(3).required(),
    'age': Joi.number()
  }
  return Joi.validate(user, userSchema);
}


//  Expoting the router so app.js can use it in a MiddleWare
module.exports = router;
