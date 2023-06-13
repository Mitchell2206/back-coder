
const socket = io();


const render = async (data) => {
  const messageHtml = document.getElementById('List-Message');
  if (data && data.messages && data.messages.length > 0) {
    data.messages.forEach((message) => {   //at render (index.js:30:19)//
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `
      <p>User: ${message.user}</p>
      <p>Message: ${message.menssage}</p>
    `;
      messageHtml.appendChild(messageElement);   // at index.js:36:19//
    });
  }
};



const renderd = (products) => {
  const template = Handlebars.compile(document.getElementById('product-template').innerHTML);
  const renderedHTML = template(products);
  document.getElementById('List-Product').innerHTML = renderedHTML;
};

socket.on('List-Product', (products) => {
  render(products);
});

socket.on('List-Message', (data) => {
  render(data); 
});

socket.on('product_updated', (data) => {
  render(data);
});
