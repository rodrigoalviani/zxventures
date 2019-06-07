/* eslint-disable consistent-return */
require('../models/pdv');

const mongoose = require('mongoose');

const PDV = mongoose.model('PDV');

exports.get = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!id) return res.status(400).json({ err: 'id is required' }).end();

  PDV.findOne({ id }, { _id: 0, __v: 0 }).exec((err, doc) => {
    if (err) return res.status(500).json({ err: err.message }).end();
    if (!doc) return res.status(404).json({ err: 'pdv not found' }).end();

    return res.status(200).json({ message: doc }).end();
  });
};

exports.search = (req, res) => {
  const ll = req.sanitize(req.query.ll);

  if (!ll) return res.status(400).json({ err: 'll is required' }).end();

  const [lng, lat] = ll.split(',');
  if (!lng || !lat) return res.status(400).json({ err: 'll is required' }).end();
  if (parseFloat(lng) < -180 || parseFloat(lng) > 180) return res.status(400).json({ err: 'long is not valid' }).end();
  if (parseFloat(lat) < -90 || parseFloat(lat) > 90) return res.status(400).json({ err: 'lat is not valid' }).end();

  PDV.find({
    coverageArea: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  }, { _id: 0, __v: 0 }).exec((err, doc) => {
    if (err) return res.status(500).json({ err: err.message }).end();
    if (!doc || !doc.length) return res.status(404).json({ err: 'pdv not found' }).end();

    return res.status(200).json({ message: doc[0] }).end();
  });
};

exports.create = (req, res) => {
  const {
    id, tradingName, ownerName, document, address, coverageArea,
  } = req.body;

  if (!id || !tradingName || !ownerName || !document || !address || !coverageArea) {
    return res.status(400).json({ err: 'all fields are required' }).end();
  }

  const newPDV = new PDV({
    id, tradingName, ownerName, document, address, coverageArea,
  });

  newPDV.save((e) => {
    if (e) return res.status(400).json({ err: 'duplicate key' }).end();
    return res.status(201).json({ message: 'created' }).end();
  });
};
