const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Crear el servidor
const app = express();

//Conectar a la base de datos
connectDB();

//Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true}));

// Puerto de la app
const port = process.env.PORT || 4000;

//Importar rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

//arrancar la app
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});