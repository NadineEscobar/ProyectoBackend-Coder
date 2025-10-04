const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const connectDB = require("./db"); 

connectDB();

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");


const ProductManager = require("./managers/ProductManager");
const productManager = new ProductManager();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


io.on("connection", async (socket) => {
  console.log("🟢 Nuevo cliente conectado");

  
  const products = await productManager.getProducts();
  socket.emit("products", products);

  
  socket.on("newProduct", async (productData) => {
    const newProduct = await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });

  
  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});