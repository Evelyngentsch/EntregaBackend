const socket = io(); // conectamos websocket del lado del cliente

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event)=>{

    event.preventDefault(); // evitar que se recargue la pagina y perder todos los datos

    const formData = new FormData(formNewProduct); // clase q viene x defecto en node, que extrae datos de un formulario
    const productData = {}; // lo convertimos a objeto

    formData.forEach((value, key)=>{

        productData[key] = value; // crear la propiedad con el nombre correcto y el valor correcto

    });

    //enviamos el obj al servidor para gaurdar en el json
    socket.emit("newProduct", productData);
});


socket.on("productAdded", (newProduct)=>{

    const productList = document.getElementById("productList");
    productList.innerHTML += `<li> ${newProduct.title} -${newProduct.descripcion}- ${newProduct.price}
     <button class="btnDelete" data-id="${newProduct.id}">Eliminar</button>
      </li>`;
});

/*
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".btnDelete");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            socket.emit("deleteProduct", productId);
        });
    });
}
*/

const productList = document.getElementById("productList");

productList.addEventListener("click", (event) => {
    if (event.target.classList.contains("btnDelete")) {
        const productId = event.target.getAttribute("data-id");
        socket.emit("deleteProduct", productId);
        
    }
});

socket.on("productDeleted", (deletedProductId) => {
    const button = document.querySelector(`button[data-id="${deletedProductId}"]`);
    if (button) {
        button.parentElement.remove(); 
    }
});


setupDeleteButtons();