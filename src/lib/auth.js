module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/profile')
    },

    authRole(rol) {
        return (req, res, next) => {
          if (req.user.rol !== rol) {
            res.status(401)
            return req.flash('message', 'Acceso denegado'),
            res.redirect('/')
          }
      
          next()
        }
      }
}