const Cart = require("../models/Cart.model");

class CartManager {
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return await Cart.findById(newCart._id).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al crear carrito: " + err.message);
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al obtener carrito: " + err.message);
    }
  }

  async addProductToCart(cartId, productId, qty = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const item = cart.products.find(p => p.product.toString() === productId);
      if (item) {
        item.quantity += Number(qty || 1);
      } else {
        cart.products.push({ product: productId, quantity: Number(qty || 1) });
      }

      await cart.save();
      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al agregar producto al carrito: " + err.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();

      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al eliminar producto del carrito: " + err.message);
    }
  }

  async replaceCartProducts(cartId, productsArray) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = productsArray;
      await cart.save();

      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al reemplazar productos del carrito: " + err.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      const item = cart.products.find(p => p.product.toString() === productId);
      if (!item) return null;

      item.quantity = Number(quantity);
      await cart.save();

      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al actualizar cantidad del producto: " + err.message);
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = [];
      await cart.save();

      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (err) {
      throw new Error("Error al vaciar carrito: " + err.message);
    }
  }
}

module.exports = CartManager;
