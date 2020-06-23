const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

rotasComentarios = function(client) {

    app.post('/cadastrarComentario', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        var par = req.body;
        var comentario = {
            username: par.username,
            email: par.email,
            comentario: par.comentario,
            dataComentario: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        collection.insertOne(comentario, (erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao cadastrar comentário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                if (resp) {
                    res.json({
                        erro: 0,
                        msg: "Comentário cadastrado com sucesso!",
                        detalhes: resp
                    });
                }
            }
        });

    })

    app.post('/recuperaUnicoComentario', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        var par = req.body;
        var comentar = {
                _id: ObjectId(par.id)
            }
            //tratativas no res.json para facilitar a maniuplação dos dados no frontend
        collection.findOne(comentar, (erro, resp) => {
            if (erro) {
                console.log(resp);
                res.json({
                    erro: 1,
                    msg: "Erro ao recuperar comentário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                if (resp) {
                    res.json({
                        erro: 0,
                        msg: "Comentário encontrado com sucesso!",
                        detalhes: resp
                    });
                } else {
                    res.json({
                        erro: 1,
                        msg: "Comentário não encontrado.",
                        detalhes: resp
                    });
                }
            }
        });
    })

    app.get('/recuperaComentariosRecente', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        collection.find().sort({ dataComentario: -1 }).limit(3).toArray((erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao recuparar comentários, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                res.json({
                    erro: 0,
                    msg: "Comentários encontrados com sucesso!",
                    detalhes: resp
                });
            }
        })
    })

    app.get('/recuperaComentariosPaginado/:pagina', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        var pagina = req.params.pagina;

        collection.find().sort({ dataComentario: -1 }).skip((pagina - 1) * 5).limit(5).toArray((erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao recuparar comentários, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {

                collection.find().count().then(function(result, errx) {
                    if (errx) {
                        res.json({
                            erro: 1,
                            msg: "Erro ao recuparar a quantidade de comentários, por favor contate o administrador do sistema!",
                            detalhes: erro
                        });
                    } else {
                        res.json({
                            erro: 0,
                            msg: "Comentários encontrados com sucesso!",
                            detalhes: resp,
                            qtd: result
                        });
                    }

                });


            }
        })
    })

    app.post('/deletarComentario', function(req, res) {
        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        var par = req.body;
        var comt = {
            _id: ObjectId(par.id)
        }

        collection.deleteOne(comt, (erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao excluir comentários, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                res.json({
                    erro: 0,
                    msg: "Comentários excluído com sucesso!",
                    detalhes: resp
                });
            }
        });
    })

    app.post('/atualizarComentario', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Comentarios");

        var par = req.body;
        console.log(ObjectId(par.id))
        var comentario = {
            _id: ObjectId(par.id),
            comentario: par.comentario
        }

        var buscaComentario = {
            _id: ObjectId(par.id)
        }

        collection.find(buscaComentario, (erro, resp) => {
            console.log(buscaComentario);
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao encontrar comentário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                resp.toArray((ers, rps) => {
                    if (rps.length) {
                        collection.updateOne(buscaComentario, { $set: comentario }, (erro, resp) => {
                            console.log(buscaComentario);
                            console.log(comentario)
                            if (erro) {
                                res.json({
                                    erro: 1,
                                    msg: "Erro ao atualizar comentário, por favor contate o administrador do sistema!",
                                    detalhes: erro
                                });
                            } else {
                                if (resp) {
                                    res.json({
                                        erro: 0,
                                        msg: "Comentário atualizado com sucesso!",
                                        detalhes: resp
                                    });
                                }
                            }
                        });
                    } else {
                        //tratativas no res.json para facilitar a maniuplação dos dados no frontend
                        res.json({
                            erro: 1,
                            msg: "Comentário não cadastrado!",
                            detalhes: rps
                        });
                    }
                })

            }
        });


    })

    return app;


}

module.exports = rotasComentarios