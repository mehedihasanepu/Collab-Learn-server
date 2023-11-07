const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rm9pnz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const assignmentCollection = client.db('collabLearn').collection('allAssignment');
        const submittedAssignmentCollection = client.db('collabLearn').collection('submittedAssignment');



        app.get('/allAssignments', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await assignmentCollection.findOne(query);
            res.send(result)
        })




        app.post('/allAssignments', async (req, res) => {
            const assignment = req.body;
            const result = await assignmentCollection.insertOne(assignment);
            res.send(result);

        })


        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateAssignment = req.body;
            const product = {
                $set: {
                    title: updateAssignment.title,
                    imgURL: updateAssignment.imgURL,
                    marks: updateAssignment.marks,
                    difficulty: updateAssignment.difficulty,
                    dueDate: updateAssignment.dueDate,
                    description: updateAssignment.description
                }
            }
            const result = await assignmentCollection.updateOne(filter, product, options)
            res.send(result)
        })


        app.delete('/allAssignments/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })




        // submitted Assignment 


        app.get('/submittedAssignment', async (req, res) => {
            const cursor = submittedAssignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('submittedAssignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await submittedAssignmentCollection.findOne(query);
            res.send(result)
        })


        app.post('/submittedAssignment', async (req, res) => {
            const assignment = req.body;
            const result = await submittedAssignmentCollection.insertOne(assignment);
            res.send(result);

        })



        app.put('/submittedAssignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateSubmittedAssignment = req.body;
            const product = {
                $set: {
                    pdfLink: updateSubmittedAssignment.pdfLink,
                    quickNote: updateSubmittedAssignment.quickNote,
                    feedback: updateSubmittedAssignment.feedback,
                    title: updateSubmittedAssignment.title,
                    giveMark: updateSubmittedAssignment.giveMark,
                    marks: updateSubmittedAssignment.marks,
                    examineeEmail: updateSubmittedAssignment.examineeEmail,
                    examineeName: updateSubmittedAssignment.examineeName,
                    status: updateSubmittedAssignment.status

                }
            }
            const result = await submittedAssignmentCollection.updateOne(filter, product, options)
            res.send(result)
        })


        app.delete('/allAssignments/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })













        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('collab learn server is running')
})

app.listen(port, () => {
    console.log(`collab learn is running in port: ${port}`);
})