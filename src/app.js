import express from "express";
import ProductManager from "./ProductManager.js";


const app = express();
app.use(express.json());

const productManager = new ProductManager("./src/products.json");

app.get("/api/products", async(req,res)=>{

    try {
        const products = await productManager.getProducts();

        res.status(200).json({status: "success", products});
    } catch (error) {

        res.status(500).json({status: "error"});
        
    }
});


app.post("/api/products", async(req, res)=>{
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({status: "success", products});

    } catch (error) {
        res.status(500).json({status: "error"});
    }
});


app.delete("/api/products/:pid", async (req, res)=> {

    try {
        const productId = req.params.pid;
        const products = await productManager.deleteProductById(productId);
        res.status(200).json({status: "success", products});
    } catch (error) {
        
        res.status(500).json({status : "error"});
    }
});


app.put("/api/products/:pid", async(req, res) =>{

    try {
        const productId = req.params.pid;
        const updateData = req.body;

        const products = await productManager.updateProductById(productId, updateData);
        res.status(200).json({status : "success", products});

    } catch (error) {
        res.status(500).json({status: "error"});
    }
});


app.get("/api/products/:pid", async(req, res)=>{

    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.status(200).json({status: "success", product});

    } catch (error) {
         res.status(500).json({status: "error"});
    }
});


app.listen (8080, ()=>{
    console.log("Servidor iniciado en puerto 8080");
});

