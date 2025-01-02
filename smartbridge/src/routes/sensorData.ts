import { Router } from "express";
import { SensorDataPoint } from "../models/sensorDataPoint";
import { query } from "../config/db";
import dotenv from 'dotenv';

dotenv.config();
const mqtt = require('mqtt')
const router = Router();
const protocol = 'mqtt'
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`
let sensorData: SensorDataPoint;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
})

const topic = process.env.MQTT_TOPIC
client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
})

client.on('message', async (topic: any, payload: any) => {
    console.log('Received Message:', topic, payload.toString())
    sensorData = JSON.parse(payload.toString())
    const result = await query("INSERT INTO "+ process.env.DB_TABLE +" (time, temperature, humidity) VALUES (NOW(), $1, $2);", [sensorData.temperature, sensorData.humidity])
    console.log("Query result ", JSON.stringify(result))
})

export default router;