const { Client } = require("pg");
import dotenv from 'dotenv';

dotenv.config();

export const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

client.on('connect', () => {
    console.log('Connected to TimescaleDB');
});

client.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

client.connect()
    .then(() => {
        console.log("Connected to TimescaleDB")
        init();
    }
    )
    .catch((err: any) => {
        console.error("Connection error", err.stack);
        process.exit(-1);
    });

const init = async () => {
    const result = await query(` 
        IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'sensor_data') THEN
        CREATE TABLE sensor_data (
            time TIMESTAMPTZ NOT NULL,
            temperature FLOAT NOT NULL,
            humidity FLOAT NOT NULL);
        END IF;`)
    console.log('Executed init query', result)
}

export const query = (statement: string, params?: any[]) => {
    const start = Date.now();
    const result = client.query(statement, params);
    const duration = Date.now() - start;
    console.log('Executed query', { statement, duration, rows: result.rowCount });
    return result;
};