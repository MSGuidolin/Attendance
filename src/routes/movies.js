const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, async (req, res) => {
    const { id } = req.user;
    const genres = await pool.query('SELECT * FROM genres WHERE user_id = ?', [id]);
    res.render('movies/add', { genres });
});

router.post('/add', async (req, res) => {
    const { title, director, genre, synopsis } = req.body;
    const newMovie = {
        title,
        director,
        genre,
        synopsis,
        user_id: req.user.id,
    };
    await pool.query('INSERT INTO movies set ?', [newMovie]);
    req.flash('success', 'Película guardada correctamente');
    res.redirect('/movies')
});

router.get('/', isLoggedIn, async (req, res) => {
    const movies = await pool.query('SELECT movies.*, genres.id as genre_id, genres.genre as genre FROM movies JOIN genres ON movies.genre = genres.id WHERE movies.user_id = ?', [req.user.id]);
    const genres = await pool.query('SELECT * FROM genres')
    res.render('movies/list', { movies, genres });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM movies WHERE id =?', [id]);
    req.flash('success', 'Película eliminada correctamente');
    res.redirect('/movies')
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const movies = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
    const genres = await pool.query('SELECT * FROM genres WHERE user_id = ?', [req.user.id]);

    const genres_with_selected = genres.map((genres) => {
        if (genres.id == movies[0].genre) {
            genres.selected = true;
        }
        return genres;
    });

    res.render('movies/edit', { movie: movies[0], genres: genres_with_selected })
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, director, genre, synopsis } = req.body;
    const newMovie = {
        title,
        director,
        genre,
        synopsis
    };
    await pool.query('UPDATE movies set ? WHERE id = ?', [newMovie, id]);
    req.flash('success', 'Película editada correctamente');
    res.redirect('/movies');
});

router.get('/see/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const movies = await pool.query('SELECT movies.*, genres.genre AS genre, genres.id AS genreId FROM movies JOIN genres ON movies.genre = genres.id WHERE movies.id = ?', [id]);

    res.render('movies/see', { movie: movies[0] });
});

module.exports = router;