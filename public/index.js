
const socket = io(); // Conecta al servidor de Socket.IO

const formNewProduct = document.getElementById("formNewProduct");
const productGrid = document.querySelector(".product-grid"); // Selecciona el contenedor de productos

// Escuchar el evento de formulario para agregar un nuevo producto
formNewProduct.addEventListener("submit", (e) => {
  e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

  const formData = new FormData(formNewProduct);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = key === 'price' || key === 'stock' ? Number(value) : value; // Convertir a número si es precio o stock
  });

  socket.emit("newProduct", productData); // Enviar los datos del nuevo producto al servidor
  formNewProduct.reset(); // Limpiar el formulario
});

// Función global para eliminar producto (llamada desde el botón)
function deleteProduct(productId) {
  socket.emit("deleteProduct", productId); // Enviar el ID del producto a eliminar
}

// Escuchar el evento 'productsUpdated' del servidor
socket.on("productsUpdated", (products) => {
  productGrid.innerHTML = ""; // Limpiar el contenedor actual de productos

  // Re-renderizar todos los productos recibidos del servidor
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
            <h2 class="product-title">${product.title}</h2>
            <h3 class="product-price">Precio: ${product.price}</h3>
            <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
    productGrid.appendChild(productCard);
  });
});

// Escuchar si hay errores al añadir/eliminar productos
socket.on("productError", (data) => {
    alert(data.message);
});


// Solicitar productos iniciales al cargar la página
socket.emit("initialProductsRequest");