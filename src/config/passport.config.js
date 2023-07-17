import passport from "passport";
import local from "passport-local"
import userController from "../controllers/user.controller.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";
import GitHubStrategy from 'passport-github2';
import { ExtractJwt, Strategy } from "passport-jwt";

const localStrategy = local.Strategy;
const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;

const inicializePassport = () => {

    passport.use(
        'register',
        new localStrategy(
            { usernameField: 'email', passReqToCallback: true },
            async (req, username, password, done) => {
                const { first_name, last_name, img } = req.body;

                try {

                    const user = await userController.getByEmail(username);


                    if (user) {
                        return done(null, false, {
                            message: 'El usuario ya existe'
                        })
                    }

                    const escripPassword = await hashPassword(password)

                    const newUser = await userController.createUser({
                        first_name,
                        last_name,
                        email: username,
                        password: escripPassword,
                        img,
                    })
    
                    return done(null, newUser)

                } catch (err) {
                    done(err);
                }
            }
        )
    )



    passport.use(
        'github',
        new GitHubStrategy(
            {

                clientID: 'Iv1.adef24a6051bd23a',
                clientSecret: 'e8bfdd189109dbdd030cd7e1e9e7817b8d5e11c5',
                callbackURL: 'http://localhost:8080/api/users/githubcallback',

            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await userController.getByEmail(
                        profile._json.email
                    );

                    if (!user) {
                        let newUser = {

                            first_name: profile._json.name,
                            last_name: '',
                            email: profile._json.email,
                            password: '',
                            img: profile._json.avatar_url,
                        }
                        user = await userController.createUser(newUser);
                    } else {

                        done(null, user)

                    }
                   
                    done(null, user)
                    

                } catch (err) {
                    done(err, false)
                }
            }

        )
    )


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })


    passport.deserializeUser(async (id, done) => {
        const user = await userController.getUserById(id);
       /* if (user.email === 'mitchel2206@gmail.com') {
            user.admin = true; // tenerlo como administrador 
        } else {
            user.admin = false
        }*/
        done(null, user);
    });


    passport.use(
        'login',
        new localStrategy(
            { usernameField: "email" },
            async (username, password, done) => {

                try {

                    const user = await userController.getByEmail(username)

                    if (!user) {
                        return done(null, false, {
                            message: 'usuario no encontrado'
                        })
                    }

                    if (!comparePassword(user, password)) {
                        return done(null, false, {
                            message: 'Data Invalida'
                        })
                    }

                    return done(null, user)

                } catch (err) {
                    done(err);
                }
            }
        )
    )



    passport.use(
        'jwt',
        new jwtStrategy(
            {
                jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
                secretOrKey: 'privatekey',
            },
            (payload, done) => {
                done(null, payload);
            }
        ),
        async (payload, done) => {
            try {
                return done(null, payload)
            } catch (error) {
                done(error)
            }
        }
    )

};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token']
    }
    return token;
}

export default inicializePassport;