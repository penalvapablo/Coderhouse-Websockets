let { Router } = require('express');
let router = new Router();
const Inventory = require('../../Inventory');
const inventory = new Inventory();

module.exports = (app) => {
  app.use('/productos', router);

  inventory.addProduct(
    'avion',
    10000,
    'https://cdn3.iconfinder.com/data/icons/education-209/64/plane-paper-toy-science-school-128.png'
  );
  inventory.addProduct(
    'reloj',
    5000,
    'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
  );

  router.post('/', (req, res) => {
    const { title, price, thumbnail } = req.body;
    if (!title || !price || !thumbnail)
      return res.json({ error: 'faltan parametros' });
    const productoNuevo = inventory.addProduct(
      title,
      price,
      thumbnail
    );
    if (!productoNuevo)
      return res.json({
        error: 'error al guardar producto',
      });
    res.redirect('/');
  });

  router.get('/', (req, res) => {
    const products = inventory.getProducts();
    res.render('productos', {
      products,
      productsExists: products.length > 0,
    });
  });
};
