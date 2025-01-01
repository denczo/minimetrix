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
    let result = await query(` 
            CREATE TABLE IF NOT EXISTS `+ process.env.DB_TABLE +` (
                time TIMESTAMPTZ NOT NULL DEFAULT now(),
                temperature FLOAT NOT NULL,
                humidity FLOAT NOT NULL
            );`)
    
    console.log('Created table', result)

    result = await query(`SELECT create_hypertable('`+ process.env.DB_TABLE +`', 'time', if_not_exists => TRUE)`)
    console.log('Created hypertable', result)
}

export const query = (statement: string, params?: any[]) => {
    const start = Date.now();
    const result = client.query(statement, params);
    const duration = Date.now() - start;
    console.log('Executed query', { statement, duration, rows: result.rowCount });
    return result;
};