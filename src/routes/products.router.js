import { Router } from "express";
import { io } from "../utils/socket.js";
import { productList } from "../utils/instances.js";


const productRouter = Router();

productRouter.get('/', async (req, res) => {

    try {
        const getProductsRouter = await productList.getProducts()
      
        res.send(getProductsRouter)
    } catch (err) {
        res.status(500).send({ err });
    }
});


productRouter.get('/:uid', async (req, res) => {
    // traemos el id especifico //
    try {
        let uid = req.params.uid
        const filterId = await productList.getProductsById(uid)
        res.status(200).send(filterId)
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
        // io.emit('product_list_updated', await productList.getProducts());
    } catch (err) {
        res.status(400).send({ err });
    }
});


productRouter.put('/:uid', async (req, res) => {
    // actualizamos los productos //
    const uid = req.params.uid;
    try {
        const productActualizado = await productList.updateProduct(uid, req.body)
        console.log(productActualizado)
        res.status(201).send(productActualizado)
    } catch (error) {
        console.log(res.status(500).send("Error al tratar de actualizar", error))
    }
})

productRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await productList.deleteProduct(id)
        res.sendStatus(204)
    } catch (error) {
        console.log(res.status(500).send("No se elimino el producto"))
    }
})

export { productRouter };