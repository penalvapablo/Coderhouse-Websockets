const express = require('express');
const moment = require('moment');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const ChatStorage = require('./storage/ChatStorage');
const cors = require('cors');
const path = require('path');
const { config } = require('./config');
const Inventory = require('./Inventory.js');
const inventory = new Inventory();

// Initializations
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(cors(`${config.cors}`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const chatStorage = new ChatStorage(
  path.join(__dirname, '/storage/chat.txt')
);

const messages = [];
chatStorage.read().then((data) => {
  messages.push(...data);
});

/* SOCKETS */
io.on('connection', (socket) => {
  console.log('nuevo cliente conectado');

  socket.emit('products', inventory.getProducts());

  socket.emit('messages', messages);

  socket.on('productAdd', (data) => {
    const { title, price, thumbnail } = data;
    inventory.addProduct(title, price, thumbnail);
    io.sockets.emit('products', inventory.getProducts());
  });

  socket.on('message', (data) => {
    const { author, message } = data;
    messages.push({
      author,
      message,
      date: moment(new Date()).format('DD/MM/YYY HH:mm:ss'),
    });
    chatStorage.save(messages);
    io.sockets.emit('messages', messages);
  });
});
/* SOCKETS */

const server = httpServer.listen(config.port, () => {
  console.log(
    `Servidor inicializado en el puerto ${config.port}.`
  );
});

server.on('error', () => {
  console.log('Error del servidor.');
});
