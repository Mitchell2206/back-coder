import CustomErrors from "../utils/customError.js";
import ErrorCodes from "../utils/error.js";
import { generateAdminNoAuthorization } from "../utils/info.js";


export function isAuth(req, res, next) {
	if (req.user.rol === 'ADMIN') {
		req.logger.warn(`${req.user.rol} no autorizado`);
        res.redirect('/profile');
		CustomErrors.createError('Admin no authorization', generateAdminNoAuthorization(), 'No Authorizacion', ErrorCodes.ADMIN_NOAUTHORIZATION);
		
	} else {
		next();
	}
}
