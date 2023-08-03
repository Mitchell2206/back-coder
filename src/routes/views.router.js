import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { isAuth, isGuest } from '../middleware/auth.middleware.js';
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";

const wiewsRouter = Router()


wiewsRouter.get('/profile', middlewarePassportJwt, (req, res) => {

  if (!req.user) {
    res.redirect('/errorcaduco')
  }

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

wiewsRouter.get('/registererror', (req, res) => {
  res.render('registererror', {
    title: 'Error en registro',
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




wiewsRouter.get('/index', isAuth, middlewarePassportJwt, async (req, res) => {
  const { limit = 4, page = 1, sort, descripcion, availability } = req.query;

  try {

    const result = await productController.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.page;
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

    //mapeo para evitar el Object.object
    const products = result.docs.map((product) => product.toObject());
    res.render("index", { title: "Products", products, prevLink, pag, totalPages, nextLink, user: req.user, });
  } catch (error) {
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});




wiewsRouter.get('/chat', isAuth, middlewarePassportJwt, (req, res) => {

  res.render('chat', { user: req.user });

});


wiewsRouter.get('/carts/', isAuth, middlewarePassportJwt, async (req, res) => {
  const productId = req.query.productId;
  console.log(productId, "aqui", { user: req.user })

  res.render('cart', { user: req.user }); // Pasar el cartId a la vista
});


export default wiewsRouter
