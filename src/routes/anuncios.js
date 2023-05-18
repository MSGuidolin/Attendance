const express = require('express');
const router = express.Router();

const pool = require('../database');
const { authRole,isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, authRole('Profesor'),  async (req, res) => {
    const cursos = await pool.query('SELECT * FROM cursos WHERE profesor = ?', [req.user.id]);
    const tipo = await pool.query('SELECT * FROM tipoAnuncios');
    console.log(cursos)
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

module.exports = router;