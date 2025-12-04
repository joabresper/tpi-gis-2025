const express = require('express');
const path = require('path');
const { testConnection, runQuery } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// para leer JSON en POST
app.use(express.json());
// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Probando conexión a PostgreSQL...');
  await testConnection();
});

function getSafeTableName(layerTable) {
  // simple validación: letras, números y guiones bajos
  if (!/^[a-zA-Z0-9_]+$/.test(layerTable)) {
    throw new Error('Nombre de tabla inválido');
  }
  return layerTable;
}

// ==========================
//  API: Carga de configuracion de GS
// ==========================
app.get('/env-config', (req, res) => {
  const config = {
    workspace: process.env.GS_WORKSPACE,
    uri: process.env.GS_URI
  };
  
  // Respondemos con código JavaScript válido
  res.set('Content-Type', 'application/javascript');
  res.send(`window.GS_CONFIG = ${JSON.stringify(config)};`);
});

// ==========================
//  API: consulta por PUNTO
// ==========================
app.post('/api/query/point', async (req, res) => {
  try {
    const { layerTable, lon, lat, radius } = req.body;

    if (layerTable == null || lon == null || lat == null) {
      return res.status(400).json({ error: 'Parámetros incompletos' });
    }

    if (radius == null || radius <= 0) {
      return res.status(400).json({ error: 'El parámetro "radius" es requerido y debe ser mayor a 0' });
    }

    const table = getSafeTableName(layerTable);

    // Usar ST_Buffer para crear un área de búsqueda alrededor del punto
    const sql = `
      SELECT
        ST_AsGeoJSON(geom) AS geom,
        to_jsonb(t) - 'geom' AS props
      FROM ${table} AS t
      WHERE ST_Intersects(
        t.geom,
        ST_Buffer(
          ST_SetSRID(ST_Point($1, $2), 4326),
          $3
        )
      )
      LIMIT 50;
    `;

    const result = await runQuery(sql, [lon, lat, radius]);

    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: JSON.parse(row.geom),
      properties: row.props
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (err) {
    console.error('Error /api/query/point:', err);
    res.status(500).json({ error: 'Error en consulta por punto' });
  }
});

// ==============================
//  API: consulta por RECTÁNGULO
// ==============================
app.post('/api/query/rect', async (req, res) => {
  try {
    const { layerTable, minx, miny, maxx, maxy, limit } = req.body;

    if (
      layerTable == null ||
      minx == null || miny == null ||
      maxx == null || maxy == null
    ) {
      return res.status(400).json({ error: 'Parámetros incompletos' });
    }

    const table = getSafeTableName(layerTable);
    const queryLimit = limit && limit > 0 ? parseInt(limit) : 50;

    const sql = `
      SELECT
        ST_AsGeoJSON(geom) AS geom,
        to_jsonb(t) - 'geom' AS props
      FROM ${table} AS t
      WHERE ST_Intersects(
        t.geom,
        ST_MakeEnvelope($1, $2, $3, $4, 4326)
      )
      LIMIT $5;
    `;

    const result = await runQuery(sql, [minx, miny, maxx, maxy, queryLimit]);

    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: JSON.parse(row.geom),
      properties: row.props
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (err) {
    console.error('Error /api/query/rect:', err);
    res.status(500).json({ error: 'Error en consulta por rectángulo' });
  }
});