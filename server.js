const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gecici veri depolama (Veritabanı baglantısı olmadıgı durumlarda da canlı calısması ıcın)
const veriler = [];

io.on('connection', (socket) => {
  socket.emit('eski_veriler', veriler);

  socket.on('yeni_veri', (data) => {
    veriler.unshift(data);
    io.emit('yeni_veri_eklendi', data);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
