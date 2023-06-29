import { Router } from "express";
import passport from "passport";




const userRouter = Router()

userRouter.post('/', passport.authenticate('register', { failureRedirect: '/registererror' }),
	async (req, res) => {
		res.redirect('/login');
	}
);

userRouter.post('/auth', passport.authenticate('login', { failureRedirect: '/loginerror' }),
	(req, res) => {

		if (!req.user) return res.status(400).send('Ningún usuario encontrado')


		const user = req.user;
		delete user.password;

		req.session.user = user; //Guardamos la session

		res.redirect('/index');
	}
);

userRouter.post('/logout', (req, res) => {
	req.session.destroy(); // hacemos un destroy para eliminar la sesión //
	res.redirect('/login');
});


// Registro Callback Github //


userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), 
	async (req, res) => { } // me redirecciona al github a loguearme //
)



userRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
    (req, res) => {
		req.session.user = req.user;
		res.redirect('/index')
	}
)


export { userRouter };