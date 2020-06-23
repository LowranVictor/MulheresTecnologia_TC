const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;

rotasUsuario = function(client) {
    app.post('/login', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Usuario");

        var par = req.body;
        var usuario = {
            email: par.email,
            senha: par.senha
        }

        //tratativas no res.json para facilitar a maniuplação dos dados no frontend
        collection.findOne(usuario, (erro, resp) => {
            if (erro) {
                console.log(resp);
                res.json({
                    erro: 1,
                    msg: "Erro ao encontrar usuário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                if (resp) {
                    res.json({
                        erro: 0,
                        msg: "Usuário encontrado com sucesso!",
                        detalhes: resp
                    });
                } else {
                    res.json({
                        erro: 1,
                        msg: "Usuário e senha inválidos, por favor tente novamente.",
                        detalhes: resp
                    });
                }
            }
        });
    })

    app.post('/recuperaUsuario', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Usuario");

        var par = req.body;
        var usuario = {
            _id: ObjectId(par.id)
        }

        //tratativas no res.json para facilitar a maniuplação dos dados no frontend
        collection.findOne(usuario, (erro, resp) => {
            if (erro) {
                console.log(resp);
                res.json({
                    erro: 1,
                    msg: "Erro ao encontrar usuário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                if (resp) {
                    res.json({
                        erro: 0,
                        msg: "Usuário encontrado com sucesso!",
                        detalhes: resp
                    });
                } else {
                    res.json({
                        erro: 1,
                        msg: "Usuário não encontrado.",
                        detalhes: resp
                    });
                }
            }
        });
    })

    app.post('/cadastrar', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Usuario");

        var par = req.body;
        var usuario = {
            nome: par.nome,
            sobrenome: par.sobrenome,
            username: par.username,
            sexo: par.sexo,
            email: par.email,
            senha: par.senha,
            pais: par.pais,
            estado: par.estado,
            cidade: par.cidade
        }

        var buscaUsuario = {
            "$or": [{
                    "username": usuario.username
                },
                {
                    "email": usuario.email
                }
            ]
        }

        collection.find(buscaUsuario, (erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao cadastrar usuário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                resp.toArray((ers, rps) => {
                    if (rps.length) {
                        res.json({
                            erro: 1,
                            msg: "Usuário já cadastrado!",
                            detalhes: rps
                        });
                    } else {
                        //tratativas no res.json para facilitar a maniuplação dos dados no frontend
                        collection.insertOne(usuario, (erro, resp) => {
                            if (erro) {
                                res.json({
                                    erro: 1,
                                    msg: "Erro ao cadastrar usuário, por favor contate o administrador do sistema!",
                                    detalhes: erro
                                });
                            } else {
                                if (resp) {
                                    res.json({
                                        erro: 0,
                                        msg: "Usuário cadastrado com sucesso!",
                                        detalhes: resp
                                    });
                                } else {
                                    res.json({
                                        erro: 1,
                                        msg: "Usuário já cadastrado, por favor realize o Login.",
                                        detalhes: resp
                                    });
                                }
                            }
                        });
                    }
                })

            }
        });


    })

    app.post('/atualizar', function(req, res) {

        const collection = client.db("MulheresTecnologia").collection("Usuario");

        var par = req.body;
        var usuario = {
            nome: par.nome,
            sobrenome: par.sobrenome,
            username: par.username,
            sexo: par.sexo,
            email: par.email,
            pais: par.pais,
            estado: par.estado,
            cidade: par.cidade
        }

        var buscaUsuario = {
            "$or": [{
                    "username": usuario.username
                },
                {
                    "email": usuario.email
                }
            ]
        }

        collection.find(buscaUsuario, (erro, resp) => {
            if (erro) {
                res.json({
                    erro: 1,
                    msg: "Erro ao cadastrar usuário, por favor contate o administrador do sistema!",
                    detalhes: erro
                });
            } else {
                resp.toArray((ers, rps) => {
                    if (rps.length) {
                        collection.updateOne(buscaUsuario, { $set: usuario }, (erro, resp) => {
                            if (erro) {
                                res.json({
                                    erro: 1,
                                    msg: "Erro ao atualizar usuário, por favor contate o administrador do sistema!",
                                    detalhes: erro
                                });
                            } else {
                                if (resp) {
                                    res.json({
                                        erro: 0,
                                        msg: "Usuário atualizado com sucesso!",
                                        detalhes: resp
                                    });
                                }
                            }
                        });
                    } else {
                        //tratativas no res.json para facilitar a maniuplação dos dados no frontend
                        res.json({
                            erro: 1,
                            msg: "Usuário não cadastrado!",
                            detalhes: rps
                        });
                    }
                })

            }
        });


    })

    return app;
}

module.exports = rotasUsuario