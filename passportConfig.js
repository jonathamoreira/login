const Register = require("./database/Register");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt")

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await Register.findOne({ where: { email: email } });
      
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user, { name: user.name });
      } else {
        return done(null, false, { message: 'Senha incorreta' });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, {id: user.id, name: user.name});
  });

  passport.deserializeUser(async (serializedUser, done) => {
    try {
      const user = await Register.findByPk(serializedUser.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}


module.exports = initialize
