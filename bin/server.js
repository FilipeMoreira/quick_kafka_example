const app = require('../src/app')
const { Kafka } = require('kafkajs');

const clientId = "kafka_ex"
const brokers = ["localhost:9092"]
const topic = "example_topic"

const port = normalizePort(process.env.PORT || '3000');

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const server = app.listen(port, function () {
    console.log(`App listening on port ${port}`)
})

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
  
io.on('connection', client => {
    console.log('Client connected to socket', client);

    const kafka = new Kafka({ clientId, brokers });
    const consumer = kafka.consumer({ groupId: clientId })

    const consume = async () => {
        await consumer.connect()
        await consumer.subscribe({ topic })
        await consumer.run({
            eachMessage: ({ message }) => {
                console.log("Message received");
                console.log(message)
                try {
                    client.emit('event', {"key": String(message.key), "value": String(message.value)});
                } catch (err) {
                    console.log("Couldn`t parse message")
                }
            },
        })
    }

    consume().catch((err) => {
        console.error("Error in the consumer: ", err)
    });
  
    client.on('disconnect', () => { 
        console.log('Client disconnected');
    });
});

module.exports = server;