import express from 'express';
import { MongoClient } from "mongodb";
import cors from 'cors';
import joi from 'joi';
import dayjs from 'dayjs';


const app = express(); // Cria um servidor
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");

//Testar como usa o dayjs
app.get("/dias", async (req, res) => {
    try {
        res.send(dayjs("1662403381133").hour+":"+dayjs("1662403381133").minute+":"+dayjs("1662403381133").second)
    } catch (error) {
	  res.sendStatus(500)
	 }
});

//----- Get /participants DONE -----

app.get("/participants", async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("test")
        const serverParticipants = db.collection("participants")
        let participants = await serverParticipants.find().toArray()
        res.send(participants)
    } catch (error) {
	  res.sendStatus(500)
	 }
});

//----- Post /participants IN PROGRESS-----
// Faltou validação e post em 'messages' com as infos do usuario

app.post("/participants", async (req, res) => {

    const username = req.body;

    const loginSchema = joi.object({
        name: joi.string().min(1).required()
    });    

    try {
        
        await mongoClient.connect();
        const db = mongoClient.db("test");
        const serverParticipants = db.collection("participants");
        const participants = serverParticipants.find().toArray();

        //Teria que vir aqui uma validacao pra ver se o login ja existe
        

        await db.collection("participants").insertOne({name : username.name, lastStatus : Date.now()});

        //Ajustar o time com o dayjs
        const msg = {from: username, to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500)
    }

});

//----- Get /messages DONE -----

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
        res.sendStatus(500)
    }
});

//----- Post /messages RASCUNHO-----

app.post("/messages", async (req, res) => {

    try {
        const messagesSchema = joi.object({
            to: joi.string().required(),
            text: joi.string().required(),
            type: joi.string().required(),
        });

        const from = req.headers.user;
        const message = req.body;

        await mongoClient.connect();
        const db = mongoClient.db("test")
        const serverMessages = db.collection("participants");
        const participants = serverMessages.find().toArray();

        const validation = messagesSchema.validate(message, {abortEarly: false});

        if (validation.error){
            console.log(validation.error.details)
            res.sendStatus(422)
            return
        }

        if (serverMessages.find(from)!=={}){
            //res.send(participants)
        }

        await db.collection("messages").insertOne(customer)
        res.send(serverMessages)


    } catch (error){
        res.sendStatus(500)
    }

});

app.listen(5000);