const fs = require("fs").promises;
const crypto = require("crypto");

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.#saveFile([]);
        return [];
      }
      throw error;
    }
  }

  async #saveFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  #generateId() {
    return crypto.randomUUID();
  }

  async createCart() {
    const carts = await this.#readFile();
    const newCart = { id: this.#generateId(), products: [] };
    carts.push(newCart);
    await this.#saveFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find((c) => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.#saveFile(carts);
    return cart;
  }
}

module.exports = CartManager;
