const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // tu usuario MySQL
    password: '',       // tu contraseña MySQL
    database: 'sistema_usuarios'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Conectado a la base de datos sistema_usuarios');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de login
app.post('/login', (req, res) => {
    const { usuario, contra } = req.body;
    const query = 'SELECT * FROM cuentas WHERE usuario = ?';

    db.query(query, [usuario], async (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        if (results.length === 0) return res.send('Usuario no encontrado');

        try {
            const match = await bcrypt.compare(contra, results[0].contra);
            if (!match) return res.send('Contraseña incorrecta');
            res.send('success'); // Redirige desde el frontend
        } catch (error) {
            res.status(500).send('Error al verificar la contraseña');
        }
    });
});

// Ruta de registro
app.post('/register', async (req, res) => {
    const { usuario, contra, nombre_completo, correo } = req.body;

    try {
        const hashed = await bcrypt.hash(contra, 10);
        const query = 'INSERT INTO cuentas (usuario, contra, nombre_completo, correo) VALUES (?, ?, ?, ?)';
        db.query(query, [usuario, hashed, nombre_completo, correo], err => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.send('Usuario o correo ya registrado');
                return res.status(500).send('Error al registrar');
            }
            res.send('Registrado');
        });
    } catch (error) {
        res.status(500).send('Error al procesar la contraseña');
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor activo en http://localhost:${port}`);
});
