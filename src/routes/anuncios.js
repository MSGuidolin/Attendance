const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//ADD
router.get('/add', isLoggedIn, async (req, res) => {
    res.render('anuncios/add');
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
    res.redirect('/anuncios')
});

//LIST
router.get('/', isLoggedIn, async (req, res) => {
    const anuncios = await pool.query('SELECT * FROM anuncios WHERE anuncios.profesor = ?', [req.user.id]);
    res.render('anuncios/list', { anuncios });
});

//SEE
router.get('/see/:idAnuncio', isLoggedIn, async (req, res) => {
    const { idAnuncio } = req.params;
    const anuncios = await pool.query('SELECT * FROM anuncios WHERE idAnuncio = ?', [idAnuncio]);
    res.render('anuncios/see', { anuncio: anuncios[0]});
});

module.exports = router;