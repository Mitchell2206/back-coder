import { Router } from "express";
import { io } from "../utils/socket.js";
import { productList } from "../utils/instances.js";
import productController from "../controllers/product.controller.js";
import ErrorCodes from "../utils/error.js";
import CustomErrors from "../utils/customError.js";
import { generateErrorProduct } from "../utils/info.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import { checkAuthorization } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.get('/', async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, descripcion, availability } = req.query;
    const products = await productController.getProducts(
      limit,
      page,
      sort,
      descripcion,
      availability
    );


    const prevPage = products.prevPage;
    const nextPage = products.nextPage;

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
  } catch (err) {
    next(err)
    res.status(400).send(err)
  }
});


productRouter.get('/:uid', async (req, res, next) => {
  try {
    let uid = req.params.uid
    const filterId = await productController.getProductsById(uid)
    res.status(200).send(filterId)
  } catch (err) {
    next(err)
    req.logger.error(`No se encontro el producto ${uid} en la base de dato`)
    res.status(400).send(err)
  }
});


productRouter.post('/', async (req, res, next) => {
  try {
    let product = req.body;
    let productos = await productController.addProducts(product);
    res.status(201).send(productos)
  } catch (err) {
    next(err)
    req.logger.error(`No se pudo agregar el producto ${product} a la base de dato`)
    res.status(500).send(err)
  }
});




productRouter.put('/:uid', middlewarePassportJwt, checkAuthorization, async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const productActualizado = await productController.updateProduct(uid, req.body)
    res.status(201).send(productActualizado)
  } catch (err) {
    next(err)
    req.logger.error(`No se pudo actualizar el producto ${uid} de la base de dato`)
    res.status(400).send(err)
  }
})

productRouter.delete('/:id', middlewarePassportJwt, checkAuthorization, async (req, res, next) => {
  const id = req.params.id
  try {
    await productController.deleteProduct(id)
    req.logger.info(`se logro eliminar el pid ${id} del base de dato`)
    res.sendStatus(204)
  } catch (err) {
    next(err)
    req.logger.error(`No se elimino el producto ${id} de la base de dato`)
    res.status(500).send(err)
  }
})

export { productRouter };