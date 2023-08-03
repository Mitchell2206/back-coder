
const socket = io();


const emitirMostrarCarrito = () => {
  console.log("Ejecuto");
  const cartIdd = localStorage.getItem('cartId');
  console.log("cartId del localStorage:", cartIdd);
  if (cartIdd) {
    setTimeout(() => {
      socket.emit('enviarCarrito', { cartIdd }, (ack) => {
        console.log('Respuesta del servidor:', ack);
      });
    }, 1000); // Espera 2 segundos antes de emitir el evento (ajusta el tiempo según tus necesidades)
  }
};


emitirMostrarCarrito();






socket.on('cartUser', ({ cartUser }) => {
  console.log(cartUser.products);
  const cartHtml = document.getElementById('mostrarCarrito');
  cartHtml.innerHTML = '';
  const cartElement = document.createElement('div');
  cartElement.innerHTML = `
  
      <ul>
        ${cartUser.products.map((product) => `
       
          <li>
          <img class="img-product" src="${product.product.thumbnail}}" alt="">
            <p class="title"> ${product.product.title}</p>
            <p>Cantidad: ${product.quantity}</p>
            <p>Precio: ${product.product.price * product.quantity}</p>   
            <button class="btn btn-sm btn-success removeProduct" data-product-id="${product.product._id}">Eliminar</button>
          </li>
        `).join('')}
      </ul>
   `;
  cartHtml.appendChild(cartElement);

  const succesCart = document.querySelectorAll(".succesCart");
  const removeProductCart = document.querySelectorAll(".removeProduct");

  removeProductCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      console.log(productId)
      const cartIdd = localStorage.getItem('cartId');
      window.location.reload();
      socket.emit('removeProduct', { cartIdd, productId });
    });
  });

  succesCart.forEach((btn) => {

    btn.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      const cartIdd = localStorage.getItem('cartId');
      console.log("cartId del localStorage:", cartIdd);
      console.log(productId)
      socket.emit('cartUser', { cartIdd, productId });
    });
  });

});

