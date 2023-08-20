import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";



const wiewsRouter = Router()


wiewsRouter.get('/profile', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  res.render('profile', {
    title: 'Perfil de Usuario',
    message: 'Private route',
    user,
    autorizacion
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


wiewsRouter.get('/forgotpassword/:token', (req, res) => {
  const token = req.params;
  res.render('forgotpassword', {
    title: 'Olvido contrasena',
    token: token.token
  });
});


wiewsRouter.get('/emailsent', (req, res) => {
  res.render('emailsent', {
    title: 'Se envio email de restablecimiento',
  });
});

wiewsRouter.get('/restpassword', (req, res) => {
  res.render('restpassword', {
    title: 'restablecer contrasena',
  });
});

wiewsRouter.get('/errorpassword', (req, res) => {
  res.render('errorpassword', {
    title: 'Error de password',
  });
});




wiewsRouter.get('/index', middlewarePassportJwt, async (req, res) => {
  const { limit = 4, page = 1, sort, descripcion, availability } = req.query;
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";

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

    res.render("index", { title: "Products", products, pag, prevLink, totalPages, nextLink, user, autorizacion });
  } catch (error) {
    req.logger.error(`No se obtuvieron los productos de la base de dato`)
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});


wiewsRouter.get('/chat', middlewarePassportJwt, (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  res.render('chat', { user, autorizacion });
});


wiewsRouter.get('/carts/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  res.render('cart', { user, autorizacion });
});


wiewsRouter.get('/changeofrole/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  res.render('changeofrole', { user, autorizacion });
});

wiewsRouter.get('/myshop/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  res.render('myshop', { user, autorizacion });
});

export default wiewsRouter
