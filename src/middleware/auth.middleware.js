import productController from "../controllers/product.controller.js";


export function isAuth(req, res, next) {
	const userRole = req.user.rol;
	if (req.user.rol === 'ADMIN') {
		req.logger.warn(`${req.user.rol} no autorizado`);
		return res.sendStatus(500)
	}
	next();

}


export async function checkAuthorization(req, res, next) {
	const userRole = req.user.rol;
	const products = await productController.getProductsById(req.params.id);
	const product = products[0];
	const productOwner = product.owner;

	if (userRole === 'PREMIUM' && req.user.email !== productOwner) {
		req.logger.warn(`${userRole}, "No puedes eliminar productos que no son tuyos"`);
		return res.sendStatus(500)
	}
	next();
}


export async function checkCartAuthorization(req, res, next) {
	const userRole = req.user.rol;
	const pid = req.params.pid;
	const products = await productController.getProductsById(pid);
	const product = products[0];
	const productOwner = product.owner;

	if (userRole === 'PREMIUM' && req.user.email === productOwner) {
		req.logger.warn(`${userRole}, No puedes agregar tu propio producto al carrito`);
		return res.sendStatus(500)
	}
	next();
}