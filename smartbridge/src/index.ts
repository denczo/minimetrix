import express, { Request, Response } from 'express';
import sensorData from './routes/sensorData';

const app = express();
const port = process.env.NODE_PORT;

app.use(express.json());
app.use('/sensorData', sensorData);

app.get('/', (req: Request, res: Response) => {
  res.send({'Microservice: SmartBridge': {
    "PORT": process.env.NODE_PORT,
    "MQTT HOST": process.env.MQTT_HOST,
    "MQTT PORT": process.env.MQTT_PORT,
    "MQTT TOPIC": process.env.MQTT_TOPIC,
  }});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});