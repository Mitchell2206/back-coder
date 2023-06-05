
const socket = io();
//creamos el js del live producto en tiempo real, trabajando con el io//
const render = async (data) => {

  console.log(data);
  const html = document.getElementById('List-Product');
  html.innerHTML = '';
  await data.products.forEach((element) => {
    const elementHtml = document.createElement('div');
    elementHtml.innerHTML = `
        <p>${element.title}</p>
        <p>${element.code}</p>
        <p>${element.price}</p>
        <p>${element.stock}</p>
      `;
    html.appendChild(elementHtml);
  });

  const messageHtml = document.getElementById('List-Message');
  if (messageHtml) {
    messageHtml.innerHTML = '';
    // Resto del código para mostrar los mensajes...
    await data.messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
      <p>User: ${message.user}</p>
      <p>Message: ${message.menssage}</p>
    `;
    messageHtml.appendChild(messageElement);
  });
  }
  
  
};

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  socket.on('List-Product', (data) => {
    render(data);
  });
  socket.on('product_updated', (data) => {
    render(data);
  });

});
