const express = require('express');
const { isLoggedIn } = require('../lib/auth')
const router = express.Router();

const pool = require('../database');

router.get('/', isLoggedIn, async (req, res) => {
    const profesor = await pool.query('SELECT rol FROM usuarios WHERE id = ? AND rol = "Profesor"' ,[req.user.id]);
    const cursos = await pool.query('SELECT C.* FROM cursos C INNER JOIN usuarios U ON U.id = C.profesor WHERE U.id = ?' ,[req.user.id]);
    const asistenciaCurso = await pool.query('SELECT asistenciaCursos.*, regularidades.nombre AS regularidad, cursos.nombre AS curso FROM asistenciaCursos INNER JOIN regularidades ON regularidades.id = asistenciaCursos.regularidad INNER JOIN cursos ON cursos.id = asistenciaCursos.curso WHERE asistenciaCursos.alumno = ? OR cursos.profesor = ?', [req.user.id, req.user.id]);
    console.log(asistenciaCurso);
    res.render('profile', {asistenciaCurso, profesor, cursos});
});

module.exports = router;