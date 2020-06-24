$(document).ready(function() {

    $('#formLogin').on('submit', function() {
        var dadosLogin = login.recuperarCamposLogin();
        login.realizaLogin(dadosLogin.email, dadosLogin.senha);
        //utilizado para página não atualizar quando realizar o submit
        return false;
    })

    $('#formDadosUsuario').on('submit', function() {
        var dadosCadastro = cadastro.recuperaDadosCadastro();

        var senhaEquivalente = cadastro.verificaSenhas(dadosCadastro.senha, dadosCadastro.confirmarSenha);

        if (senhaEquivalente) {
            cadastro.cadastraUsuario(dadosCadastro.nome, dadosCadastro.sobrenome,
                dadosCadastro.username, dadosCadastro.sexo, dadosCadastro.email, dadosCadastro.senha,
                dadosCadastro.pais, dadosCadastro.estado, dadosCadastro.cidade);

        }
        return false;
    });

    cadastro.recuperaEstado();

    $('#cidade').select2()
    $("#estado").on("select2:select", function(e) {
        $("#cidade").select2("destroy");
        cadastro.recuperaCidade(e.params.data.id);
    });

});

var login = {
    recuperarCamposLogin: function() {
        var email = $('#inputEmail').val();
        var senha = $('#inputPassword').val();

        return { email: email, senha: senha }
    },

    realizaLogin: function(emailUsu, senhaUsu) {
        $.ajax({
            url: 'http://localhost:3000/User/login',
            method: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            data: JSON.stringify({
                email: emailUsu,
                senha: senhaUsu
            }),
            success: function(retornoApi) {
                if (retornoApi.erro == 0) {
                    localStorage.setItem('idUsuario', retornoApi.detalhes._id);
                    location.href = 'home.html';
                } else
                    alert('Usuário ou senha inválido');
            },
            error: function(erroApi) {
                alert('Ocorreu um erro ao tentar realizar o login, por favor tente mais tarde.');
            }

        })
    }
};

var cadastro = {

    recuperaDadosCadastro: function() {
        var nome = $('#firstName').val();
        var sobrenome = $('#lastName').val();
        var username = $('#username').val();
        var sexo = $('#sexo').val();
        var email = $('#email').val();
        var senha = $('#senha').val();
        var confirmarSenha = $('#confirmarSenha').val();
        var pais = $('#pais').val();
        var estado = $('#estado').val();
        var cidade = $('#cidade').val();

        return { nome: nome, sobrenome: sobrenome, username: username, sexo: sexo, email: email, senha: senha, confirmarSenha: confirmarSenha, pais: pais, estado: estado, cidade: cidade }

    },

    verificaSenhas: function(senha, confirmaSenha) {
        if (senha == confirmaSenha) {
            return true;
        } else {
            alert('As senhas dos campos Senha e Confirmar Senha não correspondem!');
            $('#senha').val('');
            $('#confirmarSenha').val('');

            return false;
        }
    },

    recuperaEstado: function() {
        $('#estado').select2({
            minimumResultsForSearch: -1,
            ajax: {
                crossDomain: true,
                url: 'http://localhost:3000/Estados/recuperaEstado',
                processResults: function(data) {
                    // Transforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data
                    };
                }
            }
        });
    },

    recuperaCidade: function(idEstado) {
        $('#cidade').select2({
            minimumResultsForSearch: -1,
            ajax: {
                crossDomain: true,
                url: 'http://localhost:3000/Estados/recuperaCidade/' + idEstado,
                processResults: function(data) {
                    // Transforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data.detalhes
                    };
                }
            }
        });
    },

    cadastraUsuario: function(nome, sobrenome, username, sexo, email, senha, pais, estado, cidade) {
        $.ajax({
            url: 'http://localhost:3000/User/cadastrar',
            method: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            data: JSON.stringify({
                nome: nome,
                sobrenome: sobrenome,
                username: username,
                sexo: sexo,
                email: email,
                senha: senha,
                pais: pais,
                estado: estado,
                cidade: cidade
            }),
            success: function(retornoApi) {
                if (retornoApi.erro == 0) {
                    localStorage.setItem('idUsuario', retornoApi.detalhes.insertedId);
                    location.href = 'home.html'
                } else
                    alert('Usuário já cadastrado');
            },
            error: function(erroApi) {
                alert('Ocorreu um erro ao tentar realizar o cadastro, por favor tente mais tarde.');
            }

        })
    }
};