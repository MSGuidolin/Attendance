const express = require('express');
const router = express.Router();

const pool = require('../database');
const { authRole,isLoggedIn } = require('../lib/auth');

router.get('/see/:id', isLoggedIn, async (req, res) => {
    const permiso = await pool.query('SELECT rol FROM usuarios WHERE id = ? AND rol = "Profesor"' ,[req.user.id]);
    const anuncios = await pool.query('SELECT anuncios.*, cursos.nombre AS curso, CONCAT(usuarios.nombre, " ",usuarios.apellido) profesor, tipoanuncios.tipo AS tipo FROM anuncios INNER JOIN usuarios ON usuarios.id = anuncios.profesor INNER JOIN cursos ON cursos.id = anuncios.curso INNER JOIN tipoAnuncios ON tipoAnuncios.id = anuncios.tipo INNER JOIN asistenciaCursos ON asistenciaCursos.curso = cursos.id WHERE anuncios.id = ?', [req.params.id]);
    res.render('anuncios/see', { anuncio: anuncios[0], permiso });
});

router.get('/add', isLoggedIn, authRole('Profesor'),  async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursos WHERE profesor = ?', [req.user.id]);
    const tipo = await pool.query('SELECT * FROM tipoAnuncios');
    res.render('anuncios/add', {cursos, tipo});
});

router.post('/add', async (req, res) => {
    const { titulo, tipo, descripcion, curso} = req.body;
    const nuevoAnuncio = {
        titulo,
        tipo,
        descripcion,
        curso,    
        profesor: req.user.id
    };
    await pool.query('INSERT INTO anuncios set ?', [nuevoAnuncio]);
    req.flash('success', 'Anuncio guardado correctamente');
    res.redirect('/')
});

router.get('/edit/:id', isLoggedIn, authRole('Profesor'), async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursos WHERE profesor = ?', [req.user.id]);
    const anuncios = await pool.query('SELECT * FROM anuncios WHERE id = ?', [req.params.id]);
    const tipos = await pool.query('SELECT * FROM tipoAnuncios');
    const selectedCurso = cursos.map((cursos) => {
        if (cursos.id == anuncios[0].curso) {
            cursos.selected = true;
        }
        return cursos;
    });
    const selectedTipo = tipos.map((tipos) => {
        if (tipos.id == anuncios[0].tipo) {
            tipos.selected = true;
        }
        return tipos;
    });
    console.log(anuncios[0]);
    res.render('anuncios/edit', { anuncio: anuncios[0], cursos: selectedCurso, selectedTipo, tipos })
});

router.post('/edit/:id', async (req, res) => {
    const { titulo, tipo, descripcion, curso} = req.body;
    const nuevoAnuncio = {
        titulo,
        tipo,
        descripcion,
        curso
    };
    await pool.query('UPDATE anuncios set ? WHERE id = ?', [nuevoAnuncio, req.params.id]);
    req.flash('success', 'Anuncio editado correctamente');
    res.redirect('/');
});

router.get('/delete/:id', isLoggedIn, authRole('Profesor'), async (req, res) => {
    await pool.query('DELETE FROM anuncios WHERE id =?', [req.params.id]);
    req.flash('success', 'Anuncio eliminado correctamente');
    res.redirect('/')
});

module.exports = router;