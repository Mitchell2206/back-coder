import { Router } from "express";
import passport from "passport";
import { generateToken, middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import ErrorCodes from "../utils/error.js";
import { generateErrorAutenticacion, generateErrorDeslogueo, generateErrorEnrutamiento, generateUserErrorInfo } from "../utils/info.js";
import CustomErrors from "../utils/customError.js";
import userController from "../controllers/user.controller.js";
import { transporter } from "../utils/nodemailer.js";
import enviroment from "../config/enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";

import jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";



const privatesecret = enviroment.KEYJWT;

const userRouter = Router()



userRouter.post('/', (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (user) {
			res.status(200).redirect('/login')
		}

		if (info) {
			req.logger.warn('Error de autenticacion en registro')
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
			req.logger.warn('Error de autenticacion en login')
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


userRouter.post('/premium/:uid', async (req, res, next) => {
	const userId = req.params.uid

	try {
		const user = await userController.getUserById(userId)

		if (user.rol === "USER") {
			user.rol = "PREMIUM"
			user.save()
		} else {
			user.rol = "USER"
			user.save()
		}


		console.log(user)
		req.session.destroy();
		res.clearCookie('connect.sid');
		res.clearCookie('token');
		res.redirect('/login')

	} catch (err) {
		req.logger.error(`no se puedo cambiar el rol del ${user.rol}`)
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



userRouter.post('/forgotpassword', async (req, res, next) => {
	const uid = req.body;

	try {
		const user = await userController.getByEmail(uid.email)
		const token = generateToken(user);

		const emailOptions = {
			from: `Restablecer Contraseña <mitchel2206@gmail.com>`,
			to: `${user.email}`,
			subject: 'Restablecimiento de Contraseña',
			html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                   <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                       <div style="text-align: center; padding: 20px 0;">
                       <h1 style="color: #333;">Restablecer tu Contraseña</h1>
					   <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
                   </div>
                   <div style="padding: 20px;">
                          <p style="margin-bottom: 20px; font-size: 16px; color: #333;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                          <p style="margin-bottom: 20px;">
                           <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;" href="http://localhost:8080/forgotpassword/${token}">Restablecer Contraseña</a>
                           </p>
                           <p style="font-size: 14px; color: #777;">Si no has solicitado esto, puedes ignorar este correo electrónico.</p>
                         </div>
                     </div>
                 </div>`,
			attachments: [],
		};


		transporter.sendMail(emailOptions, (error, info) => {
			if (error) {
				req.logger.error(error)
			}
			req.logger.info('Email sent: ' + info)
		})
		res.redirect('/emailsent')
	} catch (err) {
		//agregar custon de errores//
		req.logger.error('no se envio el email de restablecimiento')
	}

});


userRouter.post('/emailreset/:token', async (req, res, next) => {
	const user = req.params.token;
	const newPassword = req.body
	const password = newPassword.password

	try {
		const decodedUser = jwt.verify(user, privatesecret);
		const userID = await userModel.findById(decodedUser._id)

		if (comparePassword(decodedUser, newPassword.password)) {
			req.logger.warn(" no puede ser la misma contrasena")
			return res.redirect('/errorpassword')
		}

		const HashPassword = await hashPassword(password)
		userID.password = HashPassword
		userID.save()

		res.redirect('/login')
	} catch (err) {
		//agregar custon de errores//
		req.logger.error('expiro el tiempo, debe volver a enviar el email')
		res.redirect('/restpassword')

	}
});


export { userRouter }