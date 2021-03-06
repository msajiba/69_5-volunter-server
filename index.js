const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


//Middleware 
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;

// Mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.panl6pn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {

    try{
        await client.connect();
        const volunteerCollection = client.db('volunteer').collection('member');
        const volunteerRegisterCollection = client.db('volunteer').collection('registerVolunteer');

        //GET VOLUNTEER
        app.get('/volunteer', async (req,res) =>{
            const query = {};
            const cursor = volunteerCollection.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        });

        //GET A VOLUNTEER
        app.get('/volunteer/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const volunteer = await volunteerCollection.findOne(query);
            res.send(volunteer);
        });


        //POST VOLUNTEER
        app.post('/volunteer', async (req, res)=>{
            const newVolunteer = req.body;
            const result = await volunteerCollection.insertOne(newVolunteer);
            res.send(result);
        });

        // VOLUNTEER REGISTER LIST POST
        app.post('/volunteerinfo', async (req, res)=> {
            const info = req.body;
            const volunteerInfo = await volunteerRegisterCollection.insertOne(info);
            res.send(volunteerInfo);
        });

        //VOLUNTEER REGISTER LIST GET
        app.get('/volunteerinfo', async (req, res) => {
            const query = {};
            const cursor = volunteerRegisterCollection.find(query);
            const volunteerRegister = await cursor.toArray();
            res.send(volunteerRegister);
        });


        //VOLUNTEER PERSON REGISTER LIST GET
      app.delete('/volunteerinfo/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const reaminVolunterRegister = await volunteerRegisterCollection.deleteOne(query);
        res.send(reaminVolunterRegister);
      });
        
    }

    finally{}

};
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('volunteer no server is running');
});



app.listen(port, ()=> {
    console.log('Server Running',port);
});