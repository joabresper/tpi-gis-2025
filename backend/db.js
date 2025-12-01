const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tpi_gis',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    // Configuración adicional del pool
    max: 20, // Número máximo de clientes en el pool
    idleTimeoutMillis: 30000, // Tiempo antes de cerrar una conexión inactiva
    connectionTimeoutMillis: 2000, // Tiempo de espera para establecer conexión
});

// Evento para manejar errores del pool
pool.on('error', (err, client) => {
    console.error('Error inesperado en el cliente de PostgreSQL', err);
    process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✓ Conexión exitosa a PostgreSQL');
        const result = await client.query('SELECT NOW()');
        console.log('Hora del servidor:', result.rows[0].now);
        client.release();
        return true;
    } catch (err) {
        console.error('✗ Error al conectar a PostgreSQL:', err.message);
        return false;
    }
};

// Función auxiliar para ejecutar consultas
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query ejecutada:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};

// Función para obtener un cliente del pool (para transacciones)
const getClient = async () => {
    const client = await pool.connect();
    const query = client.query.bind(client);
    const release = client.release.bind(client);

    // Configurar timeout para la transacción
    const timeout = setTimeout(() => {
        console.error('Cliente ha estado activo por más de 5 segundos');
    }, 5000);

    client.release = () => {
        clearTimeout(timeout);
        client.release = release;
        return release();
    };

    return client;
};

module.exports = {
    pool,
    query,
    getClient,
    testConnection
};
