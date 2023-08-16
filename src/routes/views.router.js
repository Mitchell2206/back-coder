import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { isAuth } from '../middleware/auth.middleware.js';
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
 

const wiewsRouter = Router()


wiewsRouter.get('/profile', middlewarePassportJwt, async (req, res) => {

  res.render('profile', {
    title: 'Perfil de Usuario',
    message: 'Private route',
    user: req.user
  });
});

wiewsRouter.get('/', (req, res) => {
  res.render('register', {
    title: 'Registrar Nuevo Usuario',
  });
});


wiewsRouter.get('/login', (req, res) => {
  res.render('login', {
    title: 'Inicio de Sesión',
  });
});

wiewsRouter.get('/dataerror', (req, res) => {
  res.render('dataerror', {
    title: 'Error en en datos ingresados',
  });
});

wiewsRouter.get('/errorexistsuser', (req, res) => {
  res.render('errorexistsuser', {
    title: 'EL usuario ya existe',
  });
});


wiewsRouter.get('/errorservidor', (req, res) => {
  res.render('errorservidor', {
    title: 'Error del servidor',
  });
});

wiewsRouter.get('/errorcaduco', (req, res) => {
  res.render('errorcaduco', {
    title: 'token jwt expired',
  });
});



wiewsRouter.get('/index', middlewarePassportJwt, async (req, res) => {
  const { limit = 4, page = 1, sort, descripcion, availability } = req.query;

  try {
    // const products = generateProducts(page, limit, sort, descripcion, availability)

    const result = await productController.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.pag;
    const prevPage = result.prevPage;
    const nextPage = result.nextPage;
    const totalPages = result.totalPages;



    const prevLink =
      prevPage &&
      `${req.baseUrl}/index/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const nextLink =
      nextPage &&
      `${req.baseUrl}/index/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const products = result.docs.map((product) => product.toObject());

    res.render("index", { title: "Products", products, products, pag, prevLink, totalPages, nextLink, user: req.user, });
  } catch (error) {
    req.logger.error(`No se obtuvieron los productos de la base de dato`)
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});


wiewsRouter.get('/chat', middlewarePassportJwt, isAuth, (req, res) => {

  res.render('chat', { user: req.user });

});


wiewsRouter.get('/carts/', middlewarePassportJwt, async (req, res) => {

  res.render('cart', { user: req.user });
});




export default wiewsRouter
