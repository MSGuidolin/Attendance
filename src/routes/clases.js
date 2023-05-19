const express = require('express');
const router = express.Router();

const pool = require('../database');
const { authRole,isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, authRole('Profesor'),  async (req, res) => {
    const curso = await pool.query('SELECT * FROM cursos WHERE id = ?', [req.params.id]);
    const alumnos = await pool.query('SELECT * FROM cursos WHERE id = ?', [curso.id]);
    console.log(alumnos);
    res.render('clases/add', {curso, alumnos});
});

module.exports = router;
