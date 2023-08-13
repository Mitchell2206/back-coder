import { Router } from "express";
import passport from "passport";
import { generateToken, middlewarePassportJwt } from "../middleware/jwt.middleware.js";

import ErrorCodes from "../utils/error.js";
import { generateErrorAutenticacion, generateErrorDeslogueo, generateErrorEnrutamiento, generateUserErrorInfo } from "../utils/info.js";
import CustomErrors from "../utils/customError.js";
import { isGuest } from "../middleware/auth.middleware.js";
import { es } from "@faker-js/faker";


const userRouter = Router()



userRouter.post('/', (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (user) {
			res.status(200).redirect('/login')
		}

		if (info) {
			CustomErrors.createError("Error de autenticacion", generateErrorAutenticacion(), 'Register Error', ErrorCodes.AUTENTICACION_ERROR);
		}

		return next(err)

	})(req, res, next);
});


userRouter.post('/auth', (req, res, next) => {
	passport.authenticate('login', (err, user, info) => {

		if (err) {
			return next(err)
		}


		if (!user) {
			CustomErrors.createError("Error de autenticacion", generateUserErrorInfo(), 'Login Error', ErrorCodes.AUTENTICACION_ERROR);
		}

		const token = generateToken(user);

		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
		}).redirect('/profile');

	})(req, res, next);
});




userRouter.post('/logout', middlewarePassportJwt, (req, res, next) => {

	if (req.user) {
		req.session.destroy();
		res.clearCookie('connect.sid');
		res.clearCookie('token');
		res.redirect('/login');
	} else {
		CustomErrors.createError('problemas en deslogueo', generateErrorDeslogueo(), 'no se pudo desloguear el usuario', ErrorCodes.DESLOGUEO_ERROR);
	}
});


userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (err, req, res, next) => {
	if (err) {
		CustomErrors.createError('Error Routing', generateErrorEnrutamiento(), 'no redireciono', ErrorCodes.ROUTING_ERROR)
	}

});


userRouter.get('/githubcallback', passport.authenticate('github'),
	(req, res) => {

		const user = req.user;
		const token = generateToken(user)
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
		}).redirect('/profile')

	}
)


export { userRouter }