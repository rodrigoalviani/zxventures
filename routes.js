const controllers = require('./controllers');

module.exports = (app) => {
  app.get('/api/pdv/:id', controllers.pdv.get);
  app.get('/api/pdv', controllers.pdv.search);
  app.post('/api/pdv', controllers.pdv.create);
};
