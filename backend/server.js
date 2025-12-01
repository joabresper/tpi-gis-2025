const express = require('express');
const path = require('path');
const { testConnection } = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Probando conexión a PostgreSQL...');
  await testConnection();
});

