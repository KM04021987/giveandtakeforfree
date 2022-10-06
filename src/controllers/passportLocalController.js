import passportLocal from "passport-local";
import passport from "passport";
import loginService from "../services/loginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    console.log('passportLocalController: initPassportLocal')
    passport.use(new LocalStrategy({
            usernameField: 'phone',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, phone, password, done) => {
            try {
                console.log('passportLocalController: calling from async')
                await loginService.findUserByPhone(phone).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `This user phone "${phone}" doesn't exist`));
                    } else {
                    if (user) {
                        let match = await loginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                }
                });
            } catch (err) {
                return done(null, false, { message: err });
            }
        }));

};

passport.serializeUser((user, done) => {
    console.log('passportLocalController: serializeUser')
    done(null, user);
});


passport.deserializeUser((user, done) => {
    console.log('passportLocalController: deserializeUser')
    const jsonData = JSON.stringify(user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonAccount = jsonParseObj.ACCOUNT

    loginService.findUserByAccount(jsonAccount).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportLocal;