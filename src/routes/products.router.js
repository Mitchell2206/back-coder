import { AsyncLocalStorage } from "async_hooks";
import { Router } from "express";
import { writeFileSync, promises, readFile } from 'fs';
import ProductManager from "../controllers/primeramitchell.js";
import { parse } from "path";

const data = JSON.parse(await promises.readFile('./src/models/products.json', 'utf-8'))


const products = []
const productsId = 1;


const productoManager1 = new ProductManager();

const productRouter = Router();

productRouter.get('/', (req, res) => {
    //aqui traigo todos los productos con su funcion limite//
    let limite = req.query.limite;
    if (data) {

        return res.send(data.slice(0, limite))

    } else {

        res.send(data)
    }
});


productRouter.get('/:id', async (req, res) => {
    let idUnico = req.params.id
    const filterId = await productoManager1.getProductsById(idUnico)
    try {
        if (filterId != undefined) {
            return res.status(200).send(filterId)
        } else {
            res.status(200).send(await filterId);
        }

    } catch (error) {
        res.status(400).send(`Problemas 400 ${error}`)
    }

});


productRouter.post('/', async (req, res) => {
    const product = req.body
    try {
        let productos = await productoManager1.addProducts(product);
        return res.status(200).send(productos)

    } catch (error) {
        console.log(res.status(400).send("No entra el producto"))
    }
});


productRouter.put('/:id', async (req, res) => {

    const id = req.params.id
    const productActualizado = req.body
    try {
        return res.status(200).send(await productoManager1.updateProduct(id, productActualizado))
    } catch (error) {
        console.log(res.status(400).send("No se actualizo el producto"))
    }
})

productRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    try{
        return res.status(200).send(await productoManager1.deleteProduct(id))
    }catch(error){
        console.log(res.status(400).send("No se elimino el producto"))
    }
})




export { productRouter };