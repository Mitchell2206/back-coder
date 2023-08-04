import { Router } from "express";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import productController from "../controllers/product.controller.js";

const ticketRouter = Router()


ticketRouter.post('/:id', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const cartClient = await cartController.getCartId(req.params.id)



  /*const productsToUpdate = cartClient.products.map(item => {
    return {
      productId: item.product._id,
      stock: item.product.stock,
      quantity: item.quantity
    };
  });

  console.log(
    productsToUpdate.products
  )


  const productUpMongo = await productController.getProducts()
  console.log(productUpMongo)*/
  // Restar la cantidad comprada del stock actual del producto
  //productUpMongo.quantity -= productsToUpdate.quantity;

  // Verificar si el stock no es negativo
  // if (productUpMongo.quantity < 0) {
  //   return res.status(400).send(`No hay suficiente stock disponible para el producto con ID ${productUpMongo.productId}.`);
  // }

  // Actualizar el producto en la base de datos usando el productController
  // await productController.updateProduct(productUpMongo._id, { quantity: productsToUpdate.quantity });

  // console.log(productController)

  const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
  const purchase_datatime = new Date().toLocaleString();

  const generateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;
  const generatedCode = generateRandomCode();


  const createTicket = await ticketController.createTicket({
    code: generatedCode,
    purchase_datatime,
    amount: total,
    purchaser: user.email,
  })

  console.log(createTicket)
})





ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  console.log(tickets)
  res.status(200).send(tickets)
})


export { ticketRouter }