const express = require('express');
const { isLoggedIn } = require('../lib/auth')
const router = express.Router();

const pool = require('../database');

/*router.get('/', isLoggedIn, async (req, res) => {
    res.render('profile');
});*/

router.get('/', isLoggedIn, async (req, res) => {
    const { id } = req.user;
    const usuarios =  await pool.query('SELECT * FROM usuarios WHERE id = ?' ,[id]);
    const alumnos = await pool.query('SELECT rol FROM usuarios WHERE id = ?' ,[id]);
    const profesores = await pool.query('SELECT rol FROM usuarios WHERE id = ?' ,[id]);
    console.log(usuarios);
    res.render('profile', { usuarios, alumnos, profesores });
});

module.exports = router;