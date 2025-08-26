const fs = require("fs").promises;
const crypto = require("crypto");

class ProductManager {
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

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find((p) => p.id === id);
  }

  async addProduct(productData) {
    const products = await this.#readFile();
    const newProduct = { id: this.#generateId(), ...productData };
    products.push(newProduct);
    await this.#saveFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields, id };
    await this.#saveFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    await this.#saveFile(filtered);
    return true;
  }
}

module.exports = ProductManager;
