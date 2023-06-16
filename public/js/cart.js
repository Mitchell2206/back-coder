const socket = io();
// Selecciona todos los botones "Agregar al carrito"
const addToCartButtons = document.querySelectorAll(".addToCart");
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
// Función para agregar un producto al carrito

const addProduct = (productId) => {
  let found = false;

  cartItems.forEach((item) => {
    if (item.productId === productId) {
      item.quantity += 1;
      found = true;
    }
  });


  if (!found) {
    const productInfo = { productId, quantity: 1 };
    cartItems.push(productInfo);
  }



  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  alert("¡Producto agregado al carrito!");

  generateCartItemsHTML();
};



socket.on('cartId', (cartId) => {
  const existingCartId = localStorage.getItem('cartId');
  if (!existingCartId) {
    localStorage.setItem('cartId', cartId);
  }
  socket.emit('cartIdMostrar', cartId);
});

const cartId = localStorage.getItem('cartId');

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    console.log(productId, cartId)
    socket.emit('agregarProducto', { cartId, productId }); // enviamos los productos y el carrito al servidor mediante su id //
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const cartId = localStorage.getItem('cartId');

  if (cartId) {
    socket.emit('agregarProducto', { cartId, productId: null });
  }
  socket.on('Cartproducts', (data) => {
    const bodyElement = document.getElementById("bodyproducts");
    const products = data.products;
    let html = '';

    products.forEach((item) => {
      const product = item.product;


      if (product !== null) {

        const productHtml = `
          <div class="product">
            <h2>${product.title}</h2>
            <p>Description: ${product.descripcion}</p>
            <p>Price: $${product.price}</p>
          </div>
        `;

        html += productHtml;
      }
    });

    bodyElement.innerHTML = html;
  });
});

