const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');

const usersRoutes = require('./routes/users')
const postsRoutes = require('./routes/posts')

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);


module.exports = app;