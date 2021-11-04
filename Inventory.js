class Inventory {
  constructor() {
    this.products = [];
    this.id = 1;
  }

  getProducts() {
    return this.products;
  }

  getProduct(id) {
    return this.products.find(
      (product) => product.id == id
    );
  }
  addProduct(title, price, thumbnail) {
    const newProduct = {
      title,
      price,
      thumbnail,
      id: this.id,
    };
    this.products.push(newProduct);
    this.id++;
    return newProduct;
  }
  updateProduct(id, title, price, thumbnail) {
    const index = this.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return null;
    }
    this.products[index] = { title, price, thumbnail, id };
    this.id++;
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(
      (product) => product.id === id
    );
    if (index === -1) {
      return null;
    }
    const [productDeleted] = this.products.splice(index, 1);
    return productDeleted;
  }
}

module.exports = Inventory;
