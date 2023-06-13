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

  console.log(cartItems)// muestro mis productos que se pushearon del local Storage //
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  alert("¡Producto agregado al carrito!");

  generateCartItemsHTML();
};

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    addProduct(productId);
  });
});

const generateCartItemsHTML = () => {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const productHTML = `
      <div>
        <p class="fw-bold">Producto: ${item.productId}</p>
        <p class="fw-bold">Cantidad: ${item.quantity}</p>
      </div>
    `;
    cartItemsContainer.innerHTML += productHTML;
  });
};

const showCartModal = () => {
  generateCartItemsHTML();
};

window.addEventListener("DOMContentLoaded", showCartModal);