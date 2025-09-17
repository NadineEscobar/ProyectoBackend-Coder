const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager("./data/products.json");

const router = Router();


router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error("❌ Error al renderizar la vista Home:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("❌ Error al renderizar la vista RealTimeProducts:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;

