import { Router } from "express";
import { promises } from 'fs';
import { io } from "../utils/socket.js";
import { productList } from "../utils/instances.js";


const productRouter = Router();

productRouter.get('/', async (req, res) => {
    const getProductsRouter = JSON.parse(await productList.getProducts())
    //aqui traigo todos los productos con su funcion limite//
    let limite = req.query.limite;
    if (getProductsRouter) {

        return res.send(getProductsRouter.slice(0, limite))

    } else {

        res.send(getProductsRouter)
    }
});


productRouter.get('/:id', async (req, res) => {
    // traemos el id especifico //
    try {
        let idUnico = req.params.id
        const filterId = await productList.getProductsById(idUnico)
        if (!filterId) {
            return res.status(200).send(filterId)
        } else {
            res.status(200).send(await filterId);
        }

    } catch (error) {
        res.status(400).send(`Problemas 400 ${error}`)
    }

});


productRouter.post('/', async (req, res) => {
    // agregamos con el metodo post y se actualiza en socket, io.emit//
    try {
        let product = req.body;
        let productos = await productList.addProducts(product);
        res.status(201).send(productos);
        io.emit('product_list_updated', await productList.getProducts());
    } catch (err) {
        res.status(400).send({ err });
    }
});


productRouter.put('/:id', async (req, res) => {
    // actualizamos los productos //
    const id = req.params.id
    const productActualizado = req.body
    try {
        return res.status(200).send(await productList.updateProduct(id, productActualizado))
    } catch (error) {
        console.log(res.status(400).send("No se actualizo el producto"))
    }
})

productRouter.delete('/:id', async (req, res) => {
// eliminamos el producto //
    try {
        const id = req.params.id
        return res.status(200).send(await productList.deleteProduct(id))
    } catch (error) {
        console.log(res.status(400).send("No se elimino el producto"))
    }
})

export { productRouter };