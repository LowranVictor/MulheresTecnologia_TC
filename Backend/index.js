const express = require('express');
const app = express();

const bp = require('body-parser');
app.use(bp.json())

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:Tc123456@cluster0-c2yfa.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.log('Não foi possível realizar conexão com o banco de dados Mongodb.', err);
        res.send("Erro");
    }
    console.log('Conexão com o banco de dados realizada com sucesso!')
    const rotas = require('./rotas/rotasUsuario')(client);
    const rotComent = require('./rotas/rotasComentarios')(client);
    const rotEstado = require('./rotas/rotasEstadoCidades')(client);

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', "GET,POST,PUT,DELETE");
        res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
        next()
    })
    app.use("/Estados", rotEstado);
    app.use("/Comentarios", rotComent);
    app.use("/User", rotas);
})

process.on('SIGINT', () => {
    console.log('Fechando conexão com o banco.')
    client.close();
});

app.listen(3000, function() { console.log('listening on 3000') });