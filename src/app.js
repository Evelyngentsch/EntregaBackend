import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";


const app = express();
app.use(express.json());

const productManager = new ProductManager("./src/products.json");

const cartManager = new CartManager();

// RUTAS DE PRODUCTO

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

// RUTAS DEL CARRITO: 

app.post("/api/carts", async(req, res) =>{

    try {
       const carts =  await cartManager.addCart();
       res.status(201).json({carts, message: "Nuevo carrito creado"});

    } catch (error) {
        res.status(500).json({status: "error"});
    }

});

app.get("/api/carts/:cid", async(req, res)=>{

    try {

        const cid = req.params.cid;
        const products = await cartManager.getProductsInCartById(cid);
        res.status(200).json({products, message: "Lista de productos"});
        
    } catch (error) {  
        res.status(500).json({status: "error"});
    }


});

app.post("/api/carts/:cid/product/:pid", async(req, res) =>{

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



app.listen (8080, ()=>{
    console.log("Servidor iniciado en puerto 8080");
});

