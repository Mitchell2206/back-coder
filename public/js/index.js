
const socket = io();

//creamos el js del live producto en tiempo real, trabajando con el io//


const renderProducts = (products) => {

  const html = document.getElementById('List-Product');

  html.innerHTML = '';
  products.forEach((product) => {
    const elementHtml = document.createElement('div');
    elementHtml.innerHTML = `
      <p>${product.title}</p>
      <p>${product.code}</p>
      <p>${product.price}</p>
      <p>${product.stock}</p>
    `;
    html.appendChild(elementHtml);
  });


};


const render = async (data) => {

  const messageHtml = document.getElementById('List-Message');
  if (data && data.messages && data.messages.length > 0) {
    data.messages.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `
      <p>User: ${message.user}</p>
      <p>Message: ${message.menssage}</p>
    `;
      messageHtml.appendChild(messageElement);
    });
  }


};


socket.on('List-Product', (data) => {
  renderProducts(data);
});

socket.on('List-Message', (data) => {
  render(data);
});

socket.on('product_updated', (data) => {
  render(data);
});
