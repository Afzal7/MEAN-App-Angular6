const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {id: '123123', title: '123123', content: '12213123123'},
    {id: '456456', title: '456456', content: '456456'},
    {id: '678678', title: '789789', content: '789789789'},
  ];

  res.status(200).json({
    message: 'AAA',
    posts: posts
  });
});

module.exports = app;
