const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { connectUser, disconnectUser, saveMessage} = require('../controllers/socket');

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

  // Ingresar al usuario a una sala específica
  // sala global, client.id, 600f4b234f7e694c9b484a69
  client.join(uid);

  // Escuchar del cliente el personal-message
  client.on('personal-message', async (payload) => {
    await saveMessage(payload);
    io.to(payload.to).emit('personal-message', payload);
  })

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
    disconnectUser(uid);
  });

});
