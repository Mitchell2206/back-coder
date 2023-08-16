import { Router } from "express";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import productModel from "../models/product.model.js";
import userController from "../controllers/user.controller.js";
import userModel from "../models/user.model.js";
import cartModel from "../models/carts.model.js";


const ticketRouter = Router()


ticketRouter.post('/:id', middlewarePassportJwt, async (req, res) => {
  const user = req.user;

  const client = await userModel.findById(user._id)
  const productMongo = await productModel.find();
  const cartClient = await cartController.getCartId(req.params.id)



  const productsToUpdate = cartClient.products.map(item => {
    return {
      productId: item.product._id,
      stock: item.product.stock,
      quantity: item.quantity
    };
  });


  for (const productUpdate of productsToUpdate) {
    const product = productMongo.find(p => p._id.toString() === productUpdate.productId.toString());
    if (product) {

      const updatedStock = product.stock - productUpdate.quantity;
      if (updatedStock < 0) {
        req.logger.warn(`no se pudo comprar el producto. su stock es ${updatedStock} `)
         res.status(300).send(cartClient)
      }


      try {



        await productModel.findByIdAndUpdate(product._id, { stock: updatedStock });

        const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        const purchase_datatime = new Date().toLocaleString();

        const generateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;
        const generatedCode = generateRandomCode();

        client.cart.push(cartClient);
        await client.save()

        const createTicket = await ticketController.createTicket({
          code: generatedCode,
          purchase_datatime,
          amount: total,
          purchaser: user.email,
        })


        res.status(201).send(createTicket)
      } catch (error) {
        req.logger.error(`Error al actualizar el stock para ${product.title}: ${error}`)
      }
    } else {
      console.log(`Producto con ID ${productUpdate.productId} no encontrado en la base de datos.`);
    }
  }
})





ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  console.log(tickets)
  res.status(200).send(tickets)
})


export { ticketRouter }