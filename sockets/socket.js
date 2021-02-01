const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { connectUser, disconnectUser} = require('../controllers/socket');

// Mensajes de Sockets
io.on("connection", client => {
  console.log("Cliente conectado");

  const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

  // Verificar autenticacion
  if (!valid) {
    return client.disconnect();
  }

  console.log('Cliente autenticado');
  connectUser(uid);

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
    disconnectUser(uid);
  });

});
