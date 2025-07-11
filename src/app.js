import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import { engine } from "express-handlebars";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js"
import { Server } from "socket.io";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";


dotenv.config(); //inicializamos las variables de entorno
const app = express(); 
app.use(express.json());  // configuramos para aceptar datos en formato json
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;


connectMongoDB();

const productManager = new ProductManager("./src/products.json"); //borrar?
const cartManager = new CartManager(); //borrar?

app.use(express.static("public")); // habilitamos la carpeta public con archivos estaticos



//configuracion handlebars 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints
app.use("/", viewsRouter); // todas mis vistas se generan desde la raiz de mi servidor /, le paso el manejador de rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


// configuracion websockets desde el servidor
io.on("connection", (socket)=>{
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async(productData)=>{

        try {
         const newProduct = await productManager.addProduct(productData);

         io.emit("productAdded", newProduct); // emitimos el producto recien agregado

        } catch (error) {
            console.error("Error al añadir el producto");
        }
    })

    socket.on("deleteProduct", async (productId) => {
    try {
        await productManager.deleteProductById(productId);
        io.emit("productDeleted", productId); // notificar a todos los clientes
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
    })
})



server.listen (PORT, ()=>{
    console.log("Servidor iniciado en puerto 8080");
});

