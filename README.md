# MiniMetrix

MiniMetrix is a homesetup that collects data from IOT devices (e.g. Pi Zero or a smartsocket) and sends it via MQTT to a broker (Mosquitoo). A microservice saves this sensor data to a time-series database (TimescaleDB), which then is visualized through Grafana for real-time monitoring. The solution provides a seamless integration of IoT devices, data storage, and visualization in a user-friendly interface.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=raspberrypi,grafana,postgres,express,nodejs,docker" />
  </a>
</p>

## Overview
![](smartbridge/public/MiniMetrix.webp?raw=true)

## Setup

raspi_temp_humpidity.py reads temperatur and humidity from a DHT11 sensor which is connected to GPIO4 of a Raspberry Pi and publishes it via MQTT. The Nous A1T supports MQTT per default and can be configured via the webinterface.

- run raspi_temp_humpidity.py in the background: nohup python3 /path/to/raspi_temp_humpidity.py &
- login to your server/VPS/Cloud, download the docker-compose.yml
- create an .env file and set all the variables (see .env_template)
- run docker compose up
- in Grafana:
    - create a new datasource and connect the timeseriesDB
    - create a new dashboard and customize it to your needs (in my case 1 gauge for temperatur, 1 gauge for humidity, 1 timeseries for both)

## Roadmap

- integrate monitoring of SmartSocket
- REST API to add new IOT devices easily
- extend Pi Zero with additional sensors (goal: independent Weather station)