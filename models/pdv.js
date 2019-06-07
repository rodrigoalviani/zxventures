const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PDVSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: { unique: true },
  },
  tradingName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
  },
  document: {
    type: String,
    required: true,
    index: { unique: true },
  },
  coverageArea: {
    type: { type: String, default: 'Point' },
    coordinates: { type: ['Polygon'] },
  },
  address: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] },
  },
});

PDVSchema.index({
  address: '2dsphere',
});

mongoose.model('PDV', PDVSchema);
