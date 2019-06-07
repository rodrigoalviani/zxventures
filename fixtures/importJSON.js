/* eslint-disable no-console */
const mongoose = require('mongoose');
const config = require('../config.json')[process.env.NODE_ENV || 'test'];
const PDVSchema = require('../models/pdv.js').schema;

const PDV = mongoose.model('PDV', PDVSchema);
const json = require('./pdvs.json');

const url = `${process.env.MONGODB}/${config.db}`;

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true })
  .then(async () => {
    console.log('Connected to the database!');

    PDV.collection.drop();
    console.log('Collection dropped!');

    const result = await PDV.insertMany(json.pdvs);

    console.log(`${result.length} documents imported to ${config.db}!`);

    mongoose.connection.close();
  })
  .catch(console.log);
