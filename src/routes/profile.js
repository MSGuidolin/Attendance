const express = require('express');
const { isLoggedIn } = require('../lib/auth')
const router = express.Router();

const pool = require('../database');

/*router.get('/', isLoggedIn, async (req, res) => {
    res.render('profile');
});*/

router.get('/', isLoggedIn, async (req, res) => {
    const { id } = req.user;
    //const usuarios =  await pool.query('SELECT * FROM usuarios WHERE id = ?' ,[id]);
    
    
    const alumnos = await pool.query('SELECT rol FROM usuarios WHERE id = ?' ,[id]);
    const profesores = await pool.query('SELECT rol FROM usuarios WHERE id = ?' ,[id]);
    const cursos = await pool.query('SELECT C.* FROM cursos C INNER JOIN usuarios U ON U.id = C.profesor WHERE U.id = ?' ,[id]);
    //console.log(usuarios);
    console.log(cursos);
    res.render('profile', { cursos, alumnos, profesores });
});

module.exports = router;