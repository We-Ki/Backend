const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_HOST);

module.exports = client;
