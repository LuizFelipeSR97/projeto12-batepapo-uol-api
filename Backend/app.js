import express from 'express';
import { MongoClient } from "mongodb";
import cors from 'cors';
import joi from 'joi';


const app = express(); // Cria um servidor
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("test");
});





//    const validation = usernameSchema.validate(username, {abortEarly: false})

//    if (validation.error){
//        console.log(validation.error.details)
//        return
//    }




//    const usernameSchema = joi.object({
//        user: joi.string().required()
//    });




//----- Get /participants -----

app.get("/participants", async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("test")
        const participants = db.collections("participants")
        res.send(participants)
    } catch (error) {
	  res.status(500).send(error)
	 }
});

//----- Post /participants -----

app.post("/participants", (req, res) => {
    // Manda como resposta o texto 'Hello World'
    res.send('Hello World' + req.params.nome);
});

//----- Get /messages -----

app.get("/messages", async (req, res) => {

    const username = req.headers.user
    const limit = req.query.limit

    try{
        await mongoClient.connect();
        const db = mongoClient.db("test")
        const serverMessages = db.collection("messages")

        let messages = await serverMessages.find({
            "$or": [{
                type: "message"
            },{
                to:username
            }]
        }).toArray();

        if (limit){
            messages=messages.slice(Number(limit)*-1)
        }

        res.send(messages);
    } catch (error) {
        res.sendStatus(422)
    }
});

//----- Post /messages -----

app.post("/messages", (req, res) => {
    // Manda como resposta o texto 'Hello World'
    res.send('Hello World' + req.params.nome);
});

app.listen(5000);