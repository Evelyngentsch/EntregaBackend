import fs from "fs";

class CartManager {
  constructor() {
    this.path = "./src/carts.json";
  }

  generateNewId(carts) {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  addCart = async () => {
    try {
      const cartsJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJson);

      const id = this.generateNewId(carts);
      carts.push({ id, products: [] }); // le paso un array vacio

      await fs.promises.writeFile(this.path,JSON.stringify(carts, null, 2), "utf-8");
      return carts;
    } catch (error) {

        throw new Error("Error al crear un carrito nuevo - ", error.message);
    }
  };


  addProductInCart = async(cid, pid, quantity) =>{

    try {

      const cartsJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJson);
      
    // Buscamos el carrito correspondiente
    const cart = carts.find((cart) => cart.id == cid);

    if (!cart) {
      throw new Error(`Carrito con id ${cid} no encontrado`);
    }

    // Buscamos si el producto ya existe en el carrito
    const existingProduct = cart.products.find((prod) => prod.id == pid);

    if (existingProduct) {
      // Si ya existe, sumamos la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si no existe, lo agregamos
      cart.products.push({ id: pid, quantity });
    }


       await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");      
       return carts;
        

    } catch (error) {
        
         throw new Error("Error al agregar un porducto al carrito - ", error.message);
    }
  }


  getProductsInCartById = async(cid) =>{

    try {

      const cartsJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJson);

      const cart = carts.find((cartData) => cartData.id == cid);
      return cart.products; // retorno los productos del carrito


    } catch (error) {
          throw new Error("Error al traer los productos del carrito - ", error.message);
    }
  }


}

export default CartManager;
