const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
