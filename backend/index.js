const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {MongoClient, ObjectId} = require('mongodb')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const createAuthRouter = require('./auth')
const authenticateToken = require('./middleware/authenticateToken')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Configurazione Multer per il file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Sono permessi solo file immagine (jpeg, png, gif, webp)'), false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Serve static files from public folder
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI)
    console.log('Connesso al database')
    return client.db('GestioneEventiDB')
  } catch(err) {
    console.log(err)
    process.exit(1)
  }
}

let database
const startServer = async () => {
  database = await connectToDatabase()
  app.use('/auth', createAuthRouter(database))
  app.listen(process.env.PORT, () => {
    console.log(`Server in ascolto su porta ${process.env.PORT}`)
  })
}

startServer()

// Rotta per l'upload delle immagini
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file fornito o tipo file non supportato' })
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    
    res.status(200).json({ 
      url: imageUrl,
      filename: req.file.filename
    })
  } catch (err) {
    console.error('Errore durante l\'upload:', err)
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ 
      error: 'Errore durante il caricamento dell\'immagine',
      details: err.message
    })
  }
})

// Rotta per eliminare un'immagine
app.delete('/upload/:filename', async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, 'public', 'uploads', filename)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return res.status(200).json({ message: 'Immagine eliminata con successo' })
    }
    
    res.status(404).json({ error: 'Immagine non trovata' })
  } catch (err) {
    console.error('Errore durante l\'eliminazione:', err)
    res.status(500).json({ 
      error: 'Errore durante l\'eliminazione dell\'immagine',
      details: err.message
    })
  }
})
app.get('/eventi', async (req, res) => {
    const { luogo, prezzoMin, prezzoMax, tipologia, pagina = 1, limite = 100 } = req.query;
    const query = {};
    if (luogo) query.luogo = luogo;
    if(tipologia) query.tipologia = tipologia;
    if (prezzoMin) query.prezzo = { $gte: Number(prezzoMin) };
    if (prezzoMax) query.prezzo = { ...query.prezzo, $lte: Number(prezzoMax) };

    try {
        const eventi = await database.collection('eventi')
            .find(query)
            .skip((pagina - 1) * limite)
            .limit(Number(limite))
            .toArray();
        res.json(eventi);
    } catch (err) {
        console.error(err);
        res.status(500).send('Errore interno del server');
    }
});
app.get('/eventi', authenticateToken, async (req, res) => {
    const { luogo, prezzoMin, prezzoMax, tipologia, pagina = 1, limite = 10 } = req.query;
    const query = {};
    if (luogo) query.luogo = luogo;
    if(tipologia) query.tipologia = tipologia;
    if (prezzoMin) query.prezzo = { $gte: Number(prezzoMin) };
    if (prezzoMax) query.prezzo = { ...query.prezzo, $lte: Number(prezzoMax) };

    try {
        const eventi = await database.collection('eventi')
            .find(query)
            .skip((pagina - 1) * limite)
            .limit(Number(limite))
            .toArray();
        res.json(eventi);
    } catch (err) {
        console.error(err);
        res.status(500).send('Errore interno del server');
    }
});
app.get('/eventi/:tipologia', async (req, res) => {
    const { tipologia } = req.params;
    const { pagina = 1, limite = 10 } = req.query;
    
    try {
        // Costruisci la query di filtro
        const query = { tipologia };
        
        // Esegui la query sul database
        const eventi = await database.collection('eventi')
            .find(query)
            .skip((pagina - 1) * limite)
            .limit(Number(limite))
            .toArray();
        
        // Se non ci sono eventi, restituisci un array vuoto
        if (eventi.length === 0) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(eventi);
    } catch (err) {
        console.error('Errore nel recupero degli eventi:', err);
        res.status(500).json({ 
            error: 'Errore interno del server',
            details: err.message 
        });
    }
});
app.get('/eventi/organizzatore/:username',  async (req, res) => {
    const { username } = req.params;
    const { pagina = 1, limite = 10 } = req.query;
    
    try {
        // Verifica che lo username sia valido
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: 'Username organizzatore non valido' });
            
        }

        // Costruisci la query di filtro
        const query = { organizzatore: username };
        
        // Esegui la query sul database con paginazione
        const eventi = await database.collection('eventi')
            .find(query)
            .skip((pagina - 1) * limite)
            .limit(Number(limite))
            .toArray();
        
        // Se non ci sono eventi, restituisci un array vuoto
        if (eventi.length === 0) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(eventi);
    } catch (err) {
        console.error('Errore nel recupero degli eventi dell\'organizzatore:', err);
        res.status(500).json({ 
            error: 'Errore interno del server',
            details: err.message 
        });
    }
});
app.post('/nuovo-evento', async (req, res) => {
    try {
        const { data, descrizione, luogo, orafine, organizzatore, prezzo, titolo, copertina, immagini, tags, tipologia } = req.body;
        
        // Verifica che copertina e immagini siano URL validi
        if (!copertina || typeof copertina !== 'string' || !copertina.startsWith('http')) {
            return res.status(400).json({ error: 'URL copertina non valido' });
        }

        if (immagini && !Array.isArray(immagini)) {
            return res.status(400).json({ error: 'Immagini deve essere un array di URL' });
        }

        // Verifica che tutti gli URL nelle immagini siano validi
        if (immagini) {
            for (const img of immagini) {
                if (typeof img !== 'string' || !img.startsWith('http')) {
                    return res.status(400).json({ error: `URL immagine non valido: ${img}` });
                }
            }
        }

        // Inserisci l'evento nel database
        const result = await database.collection('eventi').insertOne({
            data,
            descrizione,
            luogo,
            orafine,
            organizzatore,
            prezzo: Number(prezzo),
            titolo,
            copertina,
            immagini: immagini || [],
            tags: tags || [],
            tipologia,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Evento creato con successo',
            id: result.insertedId
        });
    } catch (err) {
        console.error('Errore nella creazione dell\'evento:', err);
        res.status(500).json({ 
            error: 'Errore interno del server',
            details: err.message 
        });
    }
});
app.delete('/eventi/:titolo/:descrizione', async (req, res) => {
    try {
        const titolo = req.params.titolo
        const descrizione = req.params.descrizione
        await database.collection('eventi').deleteOne({titolo: titolo, descrizione: descrizione})
        res.status(200).send('Evento eliminato')
    } catch (err) {
        console.error(err)
        res.status(500).send('Errore interno del server')
    }
})
app.put('/eventi/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { 
            data, 
            descrizione, 
            luogo, 
            orafine, 
            organizzatore, 
            prezzo, 
            titolo, 
            copertina,
            immagini, 
            tags, 
            tipologia 
        } = req.body;

        // Converti l'ID in ObjectId
        const objectId = new ObjectId(id);
        
        const result = await database.collection('eventi').updateOne(
            { _id: objectId },
            { $set: { 
                data, 
                descrizione, 
                luogo, 
                orafine, 
                organizzatore, 
                prezzo, 
                titolo, 
                copertina,
                immagini, 
                tags, 
                tipologia,
                ultimaModifica: new Date() // Aggiungi campo ultima modifica
            }}
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Evento non trovato' });
        }

        res.status(200).json({ 
            success: true,
            message: 'Evento aggiornato con successo',
            modifiedCount: result.modifiedCount
        });
        
    } catch (err) {
        console.error('Errore durante l\'aggiornamento:', err);
        res.status(500).json({ 
            error: 'Errore interno del server',
            details: err.message 
        });
    }
});
app.get('/eventi/:titolo/:descrizione', async (req, res) => {
    try {
        const titolo = req.params.titolo;
        const descrizione = req.params.descrizione;
        const evento = await database.collection('eventi').findOne({ titolo: titolo, descrizione: descrizione });
        
        if (!evento) {
            return res.status(404).send('Evento non trovato');
        }
        
        res.status(200).json(evento);
    } catch (err) {
        console.error(err);
        res.status(500).send('Errore interno del server');
    }
});