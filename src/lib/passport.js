const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signup', new LocalStrategy({
  usernameField: 'dni',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, dni, contraseña, done) => {

  const { nombre, apellido, direccion, telefono, rol } = req.body;

  const newUser = {
    nombre, 
    dni,
    apellido, 
    direccion, 
    telefono, 
    rol,
    contraseña
  };
  newUser.contraseña = await helpers.encryptPassword(contraseña);
  const result = await pool.query('INSERT INTO usuarios SET ?', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
})



passport.use('local.signin', new LocalStrategy({
  usernameField: 'dni',
  passwordField: 'contraseña',
  passReqToCallback: true
}, async (req, dni, contraseña, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE dni = ?', [dni]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(contraseña, user.contraseña)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.nombre + user.apellido));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Usuario inválido'));
  }

}));