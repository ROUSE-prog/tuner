// routes/songs.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const { order, is_favorite } = req.query;
    let query = 'SELECT * FROM songs';
    const queryParams = [];

    if (is_favorite !== undefined) {
        queryParams.push(is_favorite === 'true');
        query += ` WHERE is_favorite = $${queryParams.length}`;
    }

    if (order === 'asc' || order === 'desc') {
        query += ` ORDER BY name ${order.toUpperCase()}`;
    }

    try {
        const songs = await db.any(query, queryParams);
        res.json(songs);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const song = await db.oneOrNone('SELECT * FROM songs WHERE id = $1', [req.params.id]);
        if (song) {
            res.json(song);
        } else {
            res.status(404).send('Song not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    const { name, artist, album, time, is_favorite } = req.body;
    if (!name || !artist || typeof is_favorite !== 'boolean') {
        return res.status(400).send('Name, artist, and is_favorite are required');
    }

    try {
        const newSong = await db.one(
            'INSERT INTO songs (name, artist, album, time, is_favorite) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, artist, album, time, is_favorite]
        );
        res.status(201).json(newSong);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await db.result('DELETE FROM songs WHERE id = $1', [req.params.id]);
        if (result.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Song not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    const { name, artist, album, time, is_favorite } = req.body;
    if (!name || !artist || typeof is_favorite !== 'boolean') {
        return res.status(400).send('Name, artist, and is_favorite are required');
    }

    try {
        const updatedSong = await db.oneOrNone(
            'UPDATE songs SET name = $1, artist = $2, album = $3, time = $4, is_favorite = $5 WHERE id = $6 RETURNING *',
            [name, artist, album, time, is_favorite, req.params.id]
        );
        if (updatedSong) {
            res.json(updatedSong);
        } else {
            res.status(404).send('Song not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
