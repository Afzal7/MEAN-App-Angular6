const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
// ./mongo "mongodb+srv://cluster0-mytwq.mongodb.net/mean-angular6" --username root

const postsRoutes = require('./routes/posts.js');
const userRoutes = require('./routes/user.js');
const Post = require('./models/post.js');

const app = express();

mongoose.connect('mongodb+srv://root:root_password@cluster0-mytwq.mongodb.net/mean-angular6')
	.then(() => {
		console.log('Mongo Connected!');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
