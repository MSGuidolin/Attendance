const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');



router.get('/add', isLoggedIn, async (req, res) => {
    res.render('genres/add');
});

router.post('/add', async (req, res) => {
    const { genre, description, mini_desc } = req.body;
    const newGenre = {
        genre,
        description,
        mini_desc,
        user_id: req.user.id,
    };
    await pool.query('INSERT INTO genres set ?', [newGenre]);
    req.flash('success', 'Género guardado correctamente');
    res.redirect('/genres')
});

router.get('/', isLoggedIn, async (req, res) => {
    const genres = await pool.query('SELECT *, (SELECT COUNT(id) FROM movies WHERE genre = genres.id) AS cantMovies FROM genres WHERE genres.user_id = ?', [req.user.id]);

    res.render('genres/list', { genres});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM movies WHERE genre =?', [id]);
    await pool.query('DELETE FROM genres WHERE id =?', [id]);
    req.flash('success', 'Género (y sus películas) eliminado correctamente');
    res.redirect('/genres')
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const genres = await pool.query('SELECT * FROM genres WHERE id = ?', [id]);

    res.render('genres/edit', { genre: genres[0] })
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { genre, description, mini_desc } = req.body;
    const newGenre = {
        genre,
        description,
        mini_desc
    };
    await pool.query('UPDATE genres set ? WHERE id = ?', [newGenre, id]);
    req.flash('success', 'Género editado correctamente');
    res.redirect('/genres');
});

router.get('/see/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const genres = await pool.query('SELECT * FROM genres WHERE id = ?', [id]);
    const movies = await pool.query('SELECT movies.*, genres.id AS genreId, genres.user_id FROM movies LEFT JOIN genres ON genres.id = movies.genre WHERE genres.user_id = ? AND genres.id = ?', [req.user.id, id]); 
    
    res.render('genres/see', { genre: genres[0], movies });
});

module.exports = router;