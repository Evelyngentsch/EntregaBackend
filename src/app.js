import express from "express";
import ProductManager from "./ProductManager.js";


const app = express();
app.use(express.json());

const productManager = new ProductManager("./src/products.json");

await productManager.addProduct({tittle: "Producto agregado ", precio: 200});
const products = await productManager.getProducts();
console.log(products);

