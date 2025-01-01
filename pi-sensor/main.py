import time
import paho.mqtt.client as mqtt
import Adafruit_DHT
import random
import json

# Set up the DHT sensor and the GPIO pin
DHT_SENSOR = Adafruit_DHT.DHT11
DHT_PIN = 4

# MQTT Setup
hostname = "49.13.74.176"  # MQTT broker IP
broker_port = 1883
topic = "mqtt/rpi"
client = mqtt.Client()

# Define on_connect and on_message callbacks
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    # Once connected, subscribe to the topic if needed (not necessary for publishing)
    # client.subscribe(topic)

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload}")

# Connect to the broker
client.on_connect = on_connect
client.on_message = on_message
client.connect(hostname, broker_port, 60)

# Retry logic for sensor reading
def read_sensor(retries=3):
    humidity, temperature = None, None
    while retries > 0:
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        if humidity is not None and temperature is not None:
            return humidity, temperature
        else:
            print(f"Failed to read sensor, retries left: {retries}")
            retries -= 1
            time.sleep(1)
    return None, None

# Start the MQTT loop in a separate thread for asynchronous communication
client.loop_start()

# Main loop to continuously read and publish data
try:
    while True:
        # Read the sensor
        humidity, temperature = read_sensor()

        if humidity is not None and temperature is not None:
            print(f"Temperature: {temperature}C, Humidity: {humidity}%")
            message = {"temperature": temperature, "humidity": humidity}

            # Publish the message
            client.publish(topic, payload=json.dumps(message), qos=2, retain=False)
        else:
            print("Failed to retrieve data after retries.")
        
        # Ensure MQTT loop is running
        client.loop()

        # Wait before reading again
        time.sleep(60)  # Delay of 60 seconds before the next reading

except KeyboardInterrupt:
    print("Program terminated by user.")
    client.loop_stop()
