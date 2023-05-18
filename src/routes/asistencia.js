const express = require('express');
const { isLoggedIn } = require('../lib/auth')
const router = express.Router();

const pool = require('../database');

router.get('/', isLoggedIn, async (req, res) => {
    const { id } = req.user;   
    const asistenciaCurso = await pool.query('SELECT asistenciaCursos.nombre AS nombrealumno, regularidades.nombre AS regularidad, cursos.nombre AS curso FROM asistenciaCursos INNER JOIN regularidades ON regularidades.id = asistenciaCursos.regularidad INNER JOIN cursos ON cursos.id = asistenciaCursos.curso WHERE asistenciaCursos.alumno = ?', [req.user.id]);
    res.render('asistencia', { asistenciaCurso });
});

module.exports = router;