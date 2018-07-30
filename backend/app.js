const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
// ./mongo "mongodb+srv://cluster0-mytwq.mongodb.net/mean-angular6" --username root

const Post = require('./models/post.js');

const app = express();

mongoose.connect('mongodb+srv://root:root_password@cluster0-mytwq.mongodb.net/mean-angular6?retryWrites=true')
	.then(() => {
		console.log('Mongo Connected!');
	})
	.catch(() => {
		console.log('Error in Connecting Mongo!');
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	next();
});

app.post('/api/posts', (req, res, next) => {
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
})

app.get('/api/posts', (req, res, next) => {
	Post.find()
		.then(documents => {
			console.log(documents);
			res.status(200).json({
				message: 'AAA',
				posts: documents
			});
		});
});
				
app.delete('/api/posts/:id', (req, res, next) => {
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

module.exports = app;
