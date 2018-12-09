/*
 * File that handel the posts routes
 */

 /*
  * @TODO this file is not finished
  *
  */

const express = require('express');
const router = express.Router();
const Joi = require('joi');




const mongoose = require('mongoose');
const Post = require('../models/posts');




let posts = [
  {'id': 1 ,
   'title': 'Hamandi',
   'desc': false,
   'numberOfLikes': 0
  },
];


// Getting information
router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(result => {
    if(!result){
      res.status(404).send('There is no such post');
    }
    res.send(result);
  }).catch(err => {
    res.status(400).send(err.message)
  });
});


// Adding a new post
router.post('/', (req, res) => {
  // Setting Schema so i can validate it
  const validating = postValidating(req.body);
  if(validating.error){
    res.status(400).send(validating.error.details);
  }else {
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      desc: req.body.desc,
      numberOfLikes: req.body.numberOfLikes
    });
    post.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
  }
});


// PUT
router.put('/:id', (req, res) => {
  // If req.body is valid
  const validating = postValidating(req.body);
  //  If the validation fails
  if(validating.error){
    res.status(400).send(validating.error.details);
  }else {
    //  You can use updateMany
    Post.updateOne( { _id: req.params.id },{ $set:req.body } )
    .then(result => {
      res.send(`Number of updated post is ${ result.n }`);
    }).catch(err => {
      res.status(400).send(err);
    });
  }
});


// Deleting a post
router.delete('/:id', (req, res) => {
  Post.remove({name: req.params.id}).then(result => {
    res.send(`Number of deleted posts is ${result.n}`)
  }).catch(err => {
    res.status(400).send(err);
  });
});




//  To validate the POST PUT requestes
function postValidating(post) {
  const postSchema = {
    'title': Joi.string().min(3).required(),
    'desc': Joi.boolean(),
    'numberOfLikes':Joi.number()
  }
  return Joi.validate(post, postSchema);
}

module.exports = router;