const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Server is running');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hrqbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	try {
		await client.connect();
		const database = client.db('walkon');
		const destinationCollections = database.collection('destinations');
		const bookingOrderCollection = database.collection('bookingOrder');

		//get all the destination
		app.get('/api/destinations', async (req, res) => {
			const cursor = destinationCollections.find({});
			const allDestinations = await cursor.toArray();
			res.send(allDestinations);

			res.send('hello from simple server :)');
		});

		//get specific destination
		app.get('/api/destinations/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await destinationCollections.findOne(query);
			res.send(result);
		});

		// POST API FOR CREATE DESTINATION
		app.post('/api/create/destinations', async (req, res) => {
			const destinationData = req.body;

			const result = await destinationCollections.insertOne(destinationData);
			res.json(result);
		});
	} finally {
		// await client.close()
	}
};
run().catch(console.dir);

app.listen(PORT, () => {
	console.log('server is running on port', PORT);
});
