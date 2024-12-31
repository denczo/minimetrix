const { Client } = require("pg");
import dotenv from 'dotenv';

dotenv.config();

export const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.PORT,
    user: process.env.USER,
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

export const query = (statement: string, params?: any[]) => {
    const start = Date.now();
    const result = client.query(statement, params);
    const duration = Date.now() - start;
    console.log('Executed query', { statement, duration, rows: result.rowCount });
    return result;
};