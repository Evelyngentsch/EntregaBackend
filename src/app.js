import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js"
import { Server } from "socket.io";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import __dirname from "../dirname.js";
import path from "path";
import Product from "./models/product.model.js";




dotenv.config(); //inicializamos las variables de entorno
const app = express(); 
app.use(express.json());  // configuramos para aceptar datos en formato json
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;


connectMongoDB();


app.use(express.static(path.join(__dirname, "public"))); // habilitamos la carpeta public con archivos estaticos



//configuracion handlebars 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

//endpoints
app.use("/", viewsRouter); // todas mis vistas se generan desde la raiz de mi servidor /, le paso el manejador de rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


// configuracion websockets desde el servidor

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

// traigo todos los productos desde la bdd
  socket.on("initialProductsRequest", async () => {
    try {
      const products = await Product.find().lean(); 
      socket.emit("productsUpdated", products);
    } catch (error) {
      console.error("Error al obtener productos iniciales:", error);
    }
  });

  socket.on("newProduct", async (productData) => {
    try {
         const newProduct = await Product.create({
        title: productData.title,
        description: productData.descripcion, 
        code: productData.code,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        // thumbnail y status se manejan por defecto 
      });

      // Obtener todos los productos actualizados para enviar a todos los clientes
      const updatedProducts = await Product.find().lean();
      io.emit("productsUpdated", updatedProducts); // Emitimos la lista completa de productos
      console.log("Producto añadido:", newProduct.title);
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      socket.emit("productError", { message: "Error al añadir el producto" });
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      const result = await Product.findByIdAndDelete(productId);
      if (result) {
        // Obtener todos los productos actualizados para enviar a todos los clientes
        const updatedProducts = await Product.find().lean();
        io.emit("productsUpdated", updatedProducts); // Notificar a todos los clientes
        console.log("Producto eliminado:", productId);
      } else {
        console.warn("Producto no encontrado para eliminar:", productId);
        socket.emit("productError", {
          message: "Producto no encontrado para eliminar",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("productError", { message: "Error al eliminar el producto" });
    }
  });
});



server.listen (PORT, ()=>{
    console.log("Servidor iniciado en puerto 8080");
});

