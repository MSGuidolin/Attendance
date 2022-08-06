const express = require('express');
const { isLoggedIn } = require('../lib/auth')
const router = express.Router();

const pool = require('../database');

router.get('/', isLoggedIn, async (req, res) => {
    const { id } = req.user;
    const [cantGenres] =  await pool.query('SELECT COUNT(id) AS cantGenres FROM genres WHERE user_id = ?' ,[id]);
    const [cantMovies] =  await pool.query('SELECT COUNT(id) AS cantMovies FROM movies WHERE user_id = ?' ,[id]);
    console.log(cantGenres, cantMovies);
    res.render('profile', { cantGenres, cantMovies});
});

module.exports = router;