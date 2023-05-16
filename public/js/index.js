
const socket = io();
//creamos el js del live producto en tiempo real, trabajando con el io//
const render = async (data) => {

    const html = document.getElementById('List-Product');
    html.innerHTML = '';
    await data.forEach((element) => {
        const elementHtml = document.createElement('div');
        elementHtml.innerHTML = `
    <p>${element.title}</p>
    <p>${element.code}</p>
    <p>${element.price}</p>
    <p>${element.stock}</p>
    `
        html.appendChild(elementHtml);
    });
};


socket.on('List-Product', (data) => {
    render(data);
});


socket.on('product_updated', (data) => {
    render(data);
});