/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const fs = require('fs');
const inflection = require('inflection');

const models = {};

fs.readdirSync(__dirname).forEach((file) => {
  const filePath = `${__dirname}/${file}`;
  if (fs.statSync(filePath).isFile() && file !== 'index.js' && /.*.js/.test(file)) {
    const modelName = inflection.camelize(file.replace('.js', '').replace('-', '_'), true);
    console.log('[Loaded Model %s]', file);
    models[modelName] = require(filePath);
  }
});

module.exports = models;
