const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-session-mysql');
const { database } = require('./keys');
const passport = require('passport');

// initializations
const app = express();
require('./lib/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaulLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


// middleware
app.use(session({
    secret: 'moviesnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.disable('etag');


//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/genres', require('./routes/genres'));
app.use('/movies', require('./routes/movies'));
app.use('/profile', require('./routes/profile'));

//public
app.use(express.static(path.join(__dirname, 'public')));

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'))
});