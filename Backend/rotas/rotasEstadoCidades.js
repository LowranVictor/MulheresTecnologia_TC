const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

rotasEstadoCidade = function(client) {

    app.get('/recuperaEstado', function(req, res) {
        console.log(res);
        const collection = client.db("MulheresTecnologia").collection("Estados");

        collection.find().sort({ NOME: 1 }).toArray((erro, resp) => {

            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao recuparar estados, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                res.json(
                    resp.map(function(estado) {
                        return {
                            id: estado.ID,
                            text: estado.NOME
                        }
                    })
                )
            }
        })
    })

    app.get('/recuperaCidade/:estado', function(req, res) {
        console.log(res);
        const collection = client.db("MulheresTecnologia").collection("Cidades");

        var par = req.params.estado;

        collection.find({ IDESTADO: par }).sort({ NOME: 1 }).toArray((erro, resp) => {

            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao recuparar cidades, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                res.json({
                    erro: 0,
                    msg: "Cidades recuperadas com sucesso",
                    detalhes: resp.map(function(cidade) {
                        return {
                            id: cidade.ID,
                            text: cidade.NOME
                        }
                    })
                })
            }
        })
    })

    return app;
}
module.exports = rotasEstadoCidade