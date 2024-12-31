import { Router, Request, Response } from "express";
import { SensorDataPoint } from "../models/sensorDataPoint";
import { query, client as dbClient } from "../config/db";

const mqtt = require('mqtt')
const router = Router();
const protocol = 'mqtt'
const host = '49.13.74.176'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`
let sensorData: SensorDataPoint;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    // username: 'emqx',
    // password: 'public',
    reconnectPeriod: 1000,
})

const topic = 'mqtt/rpi'
client.on('connect', () => {
    console.log('Connected')
    dbClient.connect();
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
        
    })
})
client.on('message', async (topic: any, payload: any) => {
    console.log('Received Message:', topic, payload.toString())
    sensorData = JSON.parse(payload.toString())
    console.log(sensorData.humidity)
    const result = await query("INSERT INTO sensor_data (time, temperatur, humidity) VALUES (NOW(), $1, $2);", [sensorData.temperatur, sensorData.humidity])
    console.log("RESULT ", result.row[0])
})


router.get('/', (req: Request, res: Response) => {
    res.json(sensorData);
});

export default router;