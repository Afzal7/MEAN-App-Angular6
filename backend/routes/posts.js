const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');

router.post('', (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});

	post.save().then(createdPost => {
		console.log(createdPost);

		res.status(201).json({
			message: 'Post Added Successfully!',
			postId: createdPost._id
		});
	});
});

router.put('/:id', (req, res, next) => {
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content
	});

	Post.updateOne({_id: req.params.id}, post).then(updatedPost => {
		console.log(updatedPost);

		res.status(200).json({
			message: 'Post Updated Successfully!'
		});
	});
})

router.get('', (req, res, next) => {
	Post.find()
		.then(documents => {
			console.log(documents);
			res.status(200).json({
				message: 'AAA',
				posts: documents
			});
		});
});

router.get('/:id', (req, res, next) => {
	Post.findById(req.params.id)
		.then(post => {
			console.log(post);
			if (post){
				res.status(200).json(post);
			} else {
				res.status(404).json({
					message: 'Post not found!'
				});
			}
		});
});

				
router.delete('/:id', (req, res, next) => {
	console.log(req.params.id);
	Post.deleteOne({_id: req.params.id}).then(response => {
		console.log(response);
		res.status(200).json({
			message: 'Post Deleted!'
		});
	})
	.catch(response => {
		console.log(response);
		res.status(500).json({
			message: response
		});
	});
});


module.exports = router;