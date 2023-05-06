import { AsyncLocalStorage } from "async_hooks";
import { Router } from "express";
import {writeFileSync, promises, readFile } from 'fs';

import { parse } from "path";

const data = JSON.parse(await promises.readFile('src/archivoDeProducts.txt', 'utf-8'))


const products = []

 
const productsId = 1;


const productRouter  = Router();

productRouter.get('/',  (req, res) => {
   //aqui traigo todos los productos con su funcion limite//
    const limite = req.query.limite;
    if (data) {
        return res.send(data.slice(0, limite))

    } else {

        res.send(data)
    }
});

productRouter.get('/:id', async (req, res) => {
    const filterId = await data.find((prod) => prod.id === parseInt(req.params.id))
    try {
        if (filterId != undefined) {
            console.log("Producto encontrado ", filterId)
            return res.send(filterId)
        }

    } catch (error) {
        res.status(400).send(`Problemas 400 ${error}`)
    }

});




productRouter.post('/',  (req, res) => {
   
    const product = req.body
 
    if (product.title != '' && product.descripcion != '' && product.price != '' && product.code != '' && product.status != '') {
      
        const idIcrement = data.map((pid) => pid.id === product.id++);
        const filtroCode = data.map(prod => prod.code === product.code);
 
        if (filtroCode.length > 0) {
           
            console.log("No puedes agregar mas de este articulo, porque es uno por persona")
            
        }
       products.push(...data, product)
       console.log(products)
       console.log("El producto con el id: ", product.id, "Ha sido agregado.");
        writeFileSync('src/archivoDeProducts.txt', JSON.stringify(products));
        res.status(201).send(product)
    } else {
        res.status(400).send(` los campos deben estar llenos ${error}`)

    }

})




export { productRouter };