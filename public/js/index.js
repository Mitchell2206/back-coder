
const socket = io();

//creamos el js del live producto en tiempo real, trabajando con el io//
const render = async (data) => {

  console.log(data, "holaaa aqui entre en data");

  /*const html = document.getElementById('List-Product');
  html.innerHTML = '';           // linea   index.js:8  //
  await data.products.forEach((element) => {
    const elementHtml = document.createElement('div');
    elementHtml.innerHTML = `
        <p>${element.title}</p>
        <p>${element.code}</p>
        <p>${element.price}</p>
        <p>${element.stock}</p>
      `;
    html.appendChild(elementHtml);
  });*/

  const messageHtml = document.getElementById('List-Message');
  if (messageHtml) {
    messageHtml.innerHTML = '';
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

socket.on('List-Message', (data) => {
  render(data);      
});

socket.on('product_updated', (data) => {
  render(data);
});
