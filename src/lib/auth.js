module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/signin');
        //req.flash('message', 'Debes ingresar para acceder a esa página')

    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/profile')
        //req.flash('message', 'No puedes acceder a esa página, ya has ingresado')
    }
}