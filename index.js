const express = require('express');
const path = require('path');
require('dotenv').config();

// DB Config
const { dbConnection } = require('./database/config')
dbConnection();

// Express app
const app = express();

// Lectura y parseo del body
app.use(express.json());

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

// Public path
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Routes
app.use('/api/login', require('./routes/auth'))

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err)

    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})