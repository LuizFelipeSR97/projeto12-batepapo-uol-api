import express from 'express';
import { MongoClient } from "mongodb";
import cors from 'cors';

const participantes=[];

const app = express(); // Cria um servidor

app.use(cors());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("test"); //O padrão é test
});

//----- Apagar -----

app.get("/teste/:nome", (req, res) => {
    // Manda como resposta o texto 'Hello World'
    res.send('Hello World' + req.params.nome);
});

//----- Get /participants -----

app.get("/participants", (req, res) => {
    res.send(participantes);
});

//----- Post /participants -----

app.post("/participants", (req, res) => {
    // Manda como resposta o texto 'Hello World'
    res.send('Hello World' + req.params.nome);
});

app.listen(5000);