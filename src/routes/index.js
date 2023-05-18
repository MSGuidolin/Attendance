const express = require ('express');
const pool = require('../database');
const router = express.Router();

router.get('/', async (req, res) => {
    const anuncios = await pool.query('SELECT anuncios.*, cursos.nombre AS curso, CONCAT(usuarios.nombre, " ",usuarios.apellido) profesor, tipoanuncios.tipo AS tipo FROM anuncios INNER JOIN usuarios ON usuarios.id = anuncios.profesor INNER JOIN cursos ON cursos.id = anuncios.curso INNER JOIN tipoAnuncios ON tipoAnuncios.id = anuncios.tipo INNER JOIN asistenciaCursos ON asistenciaCursos.curso = cursos.id WHERE asistenciaCursos.alumno = ?', [req.user.id]);
    console.log(anuncios);
    res.render('index', {anuncios});
});

module.exports = router; 