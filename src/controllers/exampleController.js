const { Kafka } = require('kafkajs');
const path = require('path');

const clientId = "kafka_ex"
const brokers = ["localhost:9092"]
const topic = "example_topic"

exports.get = (req, res, next) => {
    res.status(201).sendFile(path.join(__dirname, '../views/example/index.html'));
};

exports.post = (req, res, next) => {
    const number = req.body.number;

    res.status(201).send("Number received");


    const kafka = new Kafka({ clientId, brokers });
    const producer = kafka.producer();

    const produce = async () => {        
        const factors = primeFactors(number);
        await producer.connect();
        try {
			await producer.send({
				topic,
				messages: [
					{
                        "key": number,
                        "value": factors,
                    },
				],
			});

            console.log("Message posted");
            console.log({
                "key": number,
                "value": factors
            })
		} catch (err) {
			console.error("could not write message " + err)
		}
    }

    produce().catch((err) => {
        console.error("Error in the producer: ", err)
    })
};


function primeFactors(number) {
    let limit = Math.sqrt(number);

    for (let i = 2; i <= limit; i++) {
        if (number % i == 0)
            return 'False';
    }

    return 'True';
}