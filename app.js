const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const cors = require('cors');

const config = require('./config.json')[process.env.NODE_ENV || 'test'];

mongoose.connect(`${process.env.MONGODB}/${config.db}`, { useNewUrlParser: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

const port = process.env.NODE_PORT || 3000;

const app = express();

app.use(cors({ exposedHeaders: ['Link'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());

require('./models');
require('./routes')(app);

app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ err: err.message }).end();
});

// eslint-disable-next-line no-console
app.listen(port, console.log(`ZXVentures at port ${port}`));

exports = app;
module.exports = app;
