
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
          </li>
        `).join('')}
      </ul>
    `;
  cartHtml.appendChild(cartElement);
});

