import CustomErrors from "../utils/customError.js";
import ErrorCodes from "../utils/error.js";
import { generateAdminNoAuthorization } from "../utils/info.js";


export function isAuth(req, res, next) {
	console.log(req.user, 'aqui entro ')

	if (req.user.rol === 'ADMIN') {
		CustomErrors.createError('Admin no authorization', generateAdminNoAuthorization(), 'No Authorizacion', ErrorCodes.ADMIN_NOAUTHORIZATION);
	} else {
		next();
	}
}

export function isGuest(req, res, next) {
	if (!req.user) {

		next();
	} else {
		res.redirect('/login');
	}
} 