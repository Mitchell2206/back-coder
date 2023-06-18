export function isAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/');
	}
}

export function auth(req, res, next){
	if (req.session.user === 'Mitchell' && req.session.admin){
		 next()
	}
	 res.status(401).send('Rol Usuario')
}