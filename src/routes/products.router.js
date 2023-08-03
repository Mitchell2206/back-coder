import { Router } from "express";
import { io } from "../utils/socket.js";
import { productList } from "../utils/instances.js";
import productController from "../controllers/product.controller.js";


const productRouter = Router();

productRouter.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, descripcion, availability } = req.query;
    const products = await productController.getProducts(
      limit,
      page,
      sort,
      descripcion,
      availability
    );

    console.log(products)

    const prevPage = products.prevPage;
    const nextPage = products.nextPage;

    //obtener ruta
    //console.log(req.baseUrl)
    const prevLink =
      prevPage &&
      `${req.baseUrl}/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    const nextLink =
      nextPage &&
      `${req.baseUrl}/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    res.status(201).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      payload: [],
      totalPages: 0,
      page: 1,
      prevPage: null,
      nextPage: null,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
    });
  }
});


productRouter.get('/:uid' , async (req, res) => {
  // traemos el id especifico //
  try {
    let uid = req.params.uid
    const filterId = await productController.getProductsById(uid)
    res.status(200).send(filterId)
  } catch (error) {
    res.status(400).send(`Problemas 400 ${error}`)
  }

});


productRouter.post('/' , async (req, res) => {
  try {
    let product = req.body;
    let productos = await productController.addProducts(product);
    res.status(201).send(productos);
  } catch (err) {
    res.status(400).send({ err });
  }
});


productRouter.put('/:uid',  async (req, res) => {
  const uid = req.params.uid;
  try {
    const productActualizado = await productController.updateProduct(uid, req.body)
    console.log(productActualizado)
    res.status(201).send(productActualizado)
  } catch (error) {
    console.log(res.status(500).send("Error al tratar de actualizar", error))
  }
})

productRouter.delete('/:id' , async (req, res) => {
  const id = req.params.id
  try {
    await productController.deleteProduct(id)
    res.sendStatus(204)
  } catch (error) {
    console.log(res.status(500).send("No se elimino el producto"))
  }
})

export { productRouter };