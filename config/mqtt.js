const mqtt = require("mqtt");

const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`);

module.exports = client;
