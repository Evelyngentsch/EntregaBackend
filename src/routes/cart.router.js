import express from "express";
import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js";


const cartRouter = express.Router();




cartRouter.post("/", async(req, res) =>{

    try {
       const cart =  new Cart();
       await cart.save();
       res.status(201).json({status: "succes", payload: cart});

    } catch (error) {
        res.status(500).json({status: "error", message: "Error al crear un carrito"});
    }

});

cartRouter.get("/:cid", async(req, res)=>{

    try {

        const cid = req.params.cid;
        const cart = await Cart.findById(cid).populate("products.product");
        if(!cart) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(200).json({status: "succes", payload: cart});
        
    } catch (error) {  
        res.status(500).json({status: "error", message: "Error al buscar el carrito"});
    }


});

// agregar un producto a un carrito ya creado

cartRouter.post("/:cid/product/:pid", async(req, res) =>{

    try {

       const {cid, pid} = req.params;
       const {quantity} = req.body; 
       
       const updatedCart = await Cart.findByIdAndUpdate(cid, {$push: {products : {product: pid, quantity }}}, {new: true});
       if(!updatedCart) return res.status(404).json({status: "error", message: "Carrito no encontrado"});
             
       res.status(201).json({status: "succes", payload: updatedCart});
      
    } catch (error) {
         res.status(500).json({status: "error"});    
    }
});

// eliminar un producto de un carrito

cartRouter.delete("/:cid/product/:pid", async (req, res) =>{

    try {
        const {cid, pid } = req.params;
        
        const updatedCart2 = await Cart.findByIdAndUpdate(cid, {$pull: {products: {product: pid}}}, {new: true});
        if(!updatedCart2) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(201).json({status: "succes", payload: updatedCart2});


    } catch (error) {
        res.status(500).json({status : "error", message: "Error al eliminar el producto"});
    }
});


// vaciar el carrito

cartRouter.delete("/:cid", async(req, res) =>{

    try {

        const cid = req.params.cid;

        const emptiedCart = await Cart.findByIdAndUpdate(cid, {$set: {products: []}}, {new: true});
        if(!emptiedCart) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(200).json({status: "succes", payload: emptiedCart});
        
    } catch (error) {
         res.status(500).json({status : "error", message: "Error al vaciar el carrito"});
    }
});


export default cartRouter;