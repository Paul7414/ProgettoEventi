const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function createAuthRouter(database) {
    const router = express.Router();

    router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verifica se l'utente esiste già
        const existingUser = await database.collection('utenti').findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username già esistente');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await database.collection('utenti').insertOne({ username, password: hashedPassword });
        res.status(201).send('Utente registrato');
        console.log('Utente registrato:', username);
    } catch (err) {
        console.error(err);
        res.status(500).send('Errore interno del server');
    }
});

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        
        try {
            const user = await database.collection('utenti').findOne({ username });
            if (!user) return res.status(401).send('Credenziali non valide');
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).send('Credenziali non valide');
            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
            console.log('Utente loggato:', username);
        } catch (err) {
            console.error(err);
            res.status(500).send('Errore interno del server');
        }
    });

    return router;
}

module.exports = createAuthRouter;