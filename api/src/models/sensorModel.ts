import { Pool } from 'pg';
import { pool } from '../config/db';

export const fetchSensorDataQuery = async () => {
    const result = await pool.query('SELECT * FROM sensor_data ORDER BY time DESC LIMIT 100');
    return result.rows;
};
