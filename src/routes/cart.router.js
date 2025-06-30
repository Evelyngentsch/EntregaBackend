import express from "express";
import CartManager  from "../CartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager();

/*
cartRouter.get("/", (req, res) =>{
    res.status(201).json({status : "success"});
});
*/


cartRouter.post("/", async(req, res) =>{

    try {
       const carts =  await cartManager.addCart();
       res.status(201).json({carts, message: "Nuevo carrito creado"});

    } catch (error) {
        res.status(500).json({status: "error"});
    }

});

cartRouter.get("/:cid", async(req, res)=>{

    try {

        const cid = req.params.cid;
        const products = await cartManager.getProductsInCartById(cid);
        res.status(200).json({products, message: "Lista de productos"});
        
    } catch (error) {  
        res.status(500).json({status: "error"});
    }


});

cartRouter.post("/:cid/product/:pid", async(req, res) =>{

    try {

        const cid = req.params.cid;
        const pid = req.params.pid;  // puedo parsear x las dudas xq los params llegan como strings x mas que sean numeros parseInt()
      //  const {cid, pid} = req.params; puedo desestructurar el objeto

       const quantity = parseInt(req.body.quantity); // tengo que capturar la cantidad del producto que llevo

       const carts =  await cartManager.addProductInCart(cid, pid, quantity);
       res.status(200).json({carts, message: "Nuevo producto agregado"});
       //200 xq no estamos creando un recurso, estamos modificando


      
    } catch (error) {
         res.status(500).json({status: "error"});    
    }
});


export default cartRouter;