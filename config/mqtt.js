const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_HOST);

export default client;
