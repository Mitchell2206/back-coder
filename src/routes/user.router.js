import { Router } from "express";
import userService from "../controllers/DAO/service/user.service.js";
import { encriptPassword, comparePassword } from "../utils/encript.util.js";

const userRouter = Router()

userRouter.post('/', async (req, res) => {
	const userData = req.body;
	try {
		const newUser = await userService.createUser(userData);
		//res.status(201).json(newUser);
		res.redirect('/login');
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

userRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	
	try {

		const admin = {
			email: "mitchel2206@gmail.com",
			password: "24591959"
		}
          console.log(admin.email, email)
		if (admin.email === email && admin.password === password) {
			req.session.user = {
				rol: "Admin",
				img: "https://res.cloudinary.com/hdsqazxtw/image/upload/v1655770489/ymgfv5xi7fcyazdihbez.jpg",
				email: "mitchel2206@gmail.com"
			}
			console.log("aqui")
			res.redirect('/index');
		} else {
			const user = await userService.getByEmail(email);
			if (!user) throw new Error('Invalid data');
			if (user.password !== password) throw new Error('Invalid data');
			// Si todo está bien, guardo el usuario en la sesión
			req.session.user = user;
			console.log("ooo aqui")
			res.redirect('/index');
		}


	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});


userRouter.post('/logout', (req, res) => {
	req.session.destroy();
	//res.status(200).json({ message: 'Logged out' });
	res.redirect('/login');
});


export { userRouter };