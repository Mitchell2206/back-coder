
const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
const socket = io.connect('http://localhost:8080', {
  extraHeaders: {
    Authorization: `Bearer ${token ? token.split('=')[1] : ''}`, // Enviar el token en el encabezado si está disponible
  },
});

console.log(socket)

const addToCartButtons = document.querySelectorAll(".addToCart");
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];




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


const existingCartId = localStorage.getItem('cartId');

socket.emit('cartId', existingCartId);

socket.on('cartId', (cart) => {
  if (cart) {
    console.log(cart)
    localStorage.setItem('cartId', cart);
  } else {
    console.error('Error al obtener el carrito del servidor o crear uno nuevo.');
  }
});

const cartId = localStorage.getItem('cartId')

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    console.log(cartId, productId)
    socket.emit('agregarProducto', { cartId, productId });
  });
});


