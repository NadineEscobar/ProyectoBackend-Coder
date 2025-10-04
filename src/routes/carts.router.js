const express = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const cm = new CartManager();
const pm = new ProductManager();


router.post("/", async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.get("/:cid", async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.post("/:cid/product/:pid", async (req, res) => {
  try {
    
    const product = await pm.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    const cart = await cm.addProductToCart(req.params.cid, req.params.pid, 1);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const result = await cm.removeProductFromCart(req.params.cid, req.params.pid);
    if (!result) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
    res.json({ status: "success", payload: result });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.put("/:cid", async (req, res) => {
  try {
    const productsArray = req.body.products; 
    const result = await cm.replaceCartProducts(req.params.cid, productsArray);
    if (!result) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: result });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const result = await cm.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!result) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
    res.json({ status: "success", payload: result });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});


router.delete("/:cid", async (req, res) => {
  try {
    const result = await cm.emptyCart(req.params.cid);
    if (!result) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", message: "Carrito vaciado" });
  } catch (err) { res.status(500).json({ status: "error", message: err.message }); }
});

module.exports = router;