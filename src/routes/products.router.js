import express from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

/*productsRouter.post("/", (req, res) =>{
    res.status(201).json({status : "success"});
});

*/

productsRouter.get("/", async(req,res)=>{

    try {
        const products = await productManager.getProducts();

        res.status(200).json({status: "success", products});
    } catch (error) {

        res.status(500).json({status: "error"});
        
    }
});

productsRouter.get("/:pid", async(req, res)=>{

    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.status(200).json({status: "success", product});

    } catch (error) {
         res.status(500).json({status: "error"});
    }
});


productsRouter.post("/", async(req, res)=>{
    try {
        const newProduct = req.body;
        const product = await productManager.addProduct(newProduct);
        res.status(201).json({status: "success", product});

    } catch (error) {
        res.status(500).json({status: "error"});
    }
});


productsRouter.delete("/:pid", async (req, res)=> {

    try {
        const productId = req.params.pid;
        const products = await productManager.deleteProductById(productId);
        res.status(200).json({status: "success", products});
    } catch (error) {
        
        res.status(500).json({status : "error"});
    }
});


productsRouter.put("/:pid", async(req, res) =>{

    try {
        const productId = req.params.pid;
        const updateData = req.body;

        const products = await productManager.updateProductById(productId, updateData);
        res.status(200).json({status : "success", products});

    } catch (error) {
        res.status(500).json({status: "error"});
    }
});




export default productsRouter;