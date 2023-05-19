const express = require('express');
const router = express.Router();

const pool = require('../database');
const { authRole,isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, authRole('Profesor'),  async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursos WHERE profesor = ? LIMIT 1', [req.user.id]);
    const alumnos = await pool.query('SELECT * FROM  usuarios WHERE rol = "Alumno" ORDER BY nombre')
    console.log(cursos);
    console.log(alumnos);
    res.render('clases/add', {curso: cursos[0], alumnos});
});

module.exports = router;
