import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import viewsRouter from "./routes/views.router.js";

import { Server } from "socket.io";
import http from "http";

import ProductManager from "./managers/ProductManager.js";


const app = express();
const PORT = 8080;

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);


// Servidor
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("io", io);


httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const productManager = new ProductManager("./src/data/products.json");

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", async (data) => {
    await productManager.addProduct(data);

    console.log("Producto recibido:", data);

    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);

    const products = await productManager.getProducts();
    io.emit("updateProducts", products);
  });
});

