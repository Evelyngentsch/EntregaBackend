import express from "express";
import Product from "../models/product.model.js";


const productsRouter = express.Router();



productsRouter.get("/", async(req,res)=>{

    try {
        const products = await Product.find(); // busco en la bdd

        res.status(200).json({status: "success", payload: products});
    } catch (error) {

        res.status(500).json({status: "error", message: "Error al recuperar los productos"});
        
    }
});

productsRouter.get("/:pid", async(req, res)=>{

    try {
        const pid = req.params.pid;

        const product = await Product.findById(pid);
        if(!product) return res.status(404).json({status: "error", message: "El producto buscado no existe"});

        res.status(200).json({status: "success", payload: product});

    } catch (error) {
         res.status(500).json({status: "error", message: "Error al mostrar el producto"});
    }
});


productsRouter.post("/", async(req, res)=>{
    try {
        const {title, description, code,  price, stock, category} = req.body;
        const product = new Product ({title, description, code,  price, stock, category });
        await product.save(); // guardo el producto en bdd
        res.status(201).json({status: "success", payload: product});

    } catch (error) {
        res.status(500).json({status: "error", message: "Error al añadir un producto"});
    }
});


productsRouter.delete("/:pid", async (req, res)=> {

    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if(!deletedProduct) return res.status(404).json({status: "error", message: "Producto no encontrado"});

        res.status(200).json({status: "success", payload: deletedProduct});
    } catch (error) {
        
        res.status(500).json({status : "error"});
    }
});


productsRouter.put("/:pid", async(req, res) =>{

    try {
        const pid = req.params.pid;
        const updateData = req.body;

        const updateProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
        if(!updateProduct) return res.status(404).json({status: "error", message: "Producto no encontrado"});

        res.status(200).json({status : "success", payload: updateProduct});

    } catch (error) {
        res.status(500).json({status: "error"});
    }
});




export default productsRouter;