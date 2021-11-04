let { Router } = require('express');
let router = new Router();
const Inventory = require('../../Inventory');
const inventory = new Inventory();

module.exports = (app) => {
  app.use('/api/productos', router);

  router.get('/', (req, res) => {
    const productos = inventory.getProducts();
    if (!productos.length) {
      return res.json({
        error: 'no hay productos cargados',
      });
    }
    res.send(productos);
  });

  router.get('/:id', (req, res) => {
    const producto = inventory.getProduct(req.params.id);
    if (!producto) {
      return res.json({ error: 'producto no encontrado' });
    }
    res.json(producto);
  });

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
    res.send(productoNuevo);
  });

  router.put('/:id', (req, res) => {
    const { title, price, thumbnail } = req.body;
    if (!title || !price || !thumbnail)
      return res.json({ error: 'faltan parametros' });
    const producto = inventory.updateProduct(
      Number(req.params.id),
      title,
      price,
      thumbnail
    );
    if (!producto) {
      return res.json({ error: 'producto no encontrado ' });
    }
    res.json(producto);
  });

  router.delete('/:id', (req, res) => {
    const producto = inventory.deleteProduct(
      Number(req.params.id)
    );
    if (!producto) {
      return res.json({ error: 'producto no encontrado' });
    }
    res.json(producto);
  });
};
